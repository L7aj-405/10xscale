<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class UpdateBrandLogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'image' => ['nullable', File::image()->types(['png', 'jpg', 'jpeg', 'webp'])->max(4 * 1024)],
            'website_url' => ['nullable', 'url:http,https', 'max:2048'],
            'position' => ['required', 'integer', 'min:0', 'max:999'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'website_url' => filled($this->input('website_url'))
                ? trim((string) $this->input('website_url'))
                : null,
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
