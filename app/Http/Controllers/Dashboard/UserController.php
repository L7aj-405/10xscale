<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDashboardUserRequest;
use App\Http\Requests\UpdateDashboardUserRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = mb_substr(trim((string) $request->query('search')), 0, 100);

        $users = User::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user) => $this->serializeUser($user));

        return Inertia::render('Dashboard/Users/Index', [
            'users' => $users,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Dashboard/Users/Create', [
            'roles' => $this->roles(),
        ]);
    }

    public function store(StoreDashboardUserRequest $request): RedirectResponse
    {
        User::query()->create($request->validated());

        return to_route('dashboard.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Dashboard/Users/Edit', [
            'managedUser' => $this->serializeUser($user),
            'roles' => $this->roles(),
        ]);
    }

    public function update(UpdateDashboardUserRequest $request, User $user): RedirectResponse
    {
        $attributes = $request->validated();

        if ($request->user()->is($user) && $attributes['role'] !== UserRole::Admin->value) {
            throw ValidationException::withMessages([
                'role' => 'You cannot remove your own administrator role.',
            ]);
        }

        if (blank($attributes['password'] ?? null)) {
            unset($attributes['password']);
        }

        DB::transaction(function () use ($attributes, $user) {
            $admins = User::query()
                ->where('role', UserRole::Admin->value)
                ->lockForUpdate()
                ->get();

            if (
                $user->isAdmin()
                && $attributes['role'] !== UserRole::Admin->value
                && $admins->count() <= 1
            ) {
                throw ValidationException::withMessages([
                    'role' => 'The final administrator cannot be demoted.',
                ]);
            }

            $user->update($attributes);
        });

        return to_route('dashboard.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->is($user)) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        DB::transaction(function () use ($user) {
            $admins = User::query()
                ->where('role', UserRole::Admin->value)
                ->lockForUpdate()
                ->get();

            if ($user->isAdmin() && $admins->count() <= 1) {
                throw ValidationException::withMessages([
                    'user' => 'The final administrator cannot be deleted.',
                ]);
            }

            $user->delete();
        });

        return to_route('dashboard.users.index')
            ->with('success', 'User deleted successfully.');
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->value,
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }

    private function roles(): array
    {
        return array_map(
            fn (UserRole $role) => ['value' => $role->value, 'label' => ucfirst($role->value)],
            UserRole::cases(),
        );
    }
}
