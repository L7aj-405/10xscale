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
            'name' => ['required', 'array'],
            'name.en' => ['required', 'string', 'max:120'],
            'name.fr' => ['nullable', 'string', 'max:120'],
            'name.ar' => ['nullable', 'string', 'max:120'],
            'role' => ['required', 'array'],
            'role.en' => ['required', 'string', 'max:120'],
            'role.fr' => ['nullable', 'string', 'max:120'],
            'role.ar' => ['nullable', 'string', 'max:120'],
            'bio' => ['required', 'array'],
            'bio.en' => ['required', 'string', 'max:1000'],
            'bio.fr' => ['nullable', 'string', 'max:1000'],
            'bio.ar' => ['nullable', 'string', 'max:1000'],
            'photo_label' => ['nullable', 'array'],
            'photo_label.en' => ['nullable', 'string', 'max:100'],
            'photo_label.fr' => ['nullable', 'string', 'max:100'],
            'photo_label.ar' => ['nullable', 'string', 'max:100'],
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
