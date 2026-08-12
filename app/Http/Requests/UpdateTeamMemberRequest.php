<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class UpdateTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'role' => ['required', 'string', 'max:120'],
            'bio' => ['required', 'string', 'max:1000'],
            'photo_label' => ['nullable', 'string', 'max:100'],
            'initials' => ['required', 'string', 'max:6'],
            'photo' => ['nullable', File::image()->types(['png', 'jpg', 'jpeg', 'webp'])->max(5 * 1024)],
            'linkedin_url' => ['nullable', 'url:http,https', 'max:2048'],
            'x_url' => ['nullable', 'url:http,https', 'max:2048'],
            'website_url' => ['nullable', 'url:http,https', 'max:2048'],
            'position' => ['required', 'integer', 'min:0', 'max:999'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'role' => trim((string) $this->input('role')),
            'bio' => trim((string) $this->input('bio')),
            'photo_label' => $this->nullableTrimmed('photo_label'),
            'initials' => mb_strtoupper(trim((string) $this->input('initials'))),
            'linkedin_url' => $this->nullableTrimmed('linkedin_url'),
            'x_url' => $this->nullableTrimmed('x_url'),
            'website_url' => $this->nullableTrimmed('website_url'),
            'is_active' => $this->boolean('is_active'),
        ]);
    }

    private function nullableTrimmed(string $key): ?string
    {
        return filled($this->input($key)) ? trim((string) $this->input($key)) : null;
    }
}
