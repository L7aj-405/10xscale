<?php

namespace App\Http\Requests;

use App\Models\SiteAppearance;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateSiteAppearanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $color = ['required', 'regex:/^#[0-9A-F]{6}$/'];

        return [
            'accent_color' => $color,
            'accent_text_color' => $color,
            'danger_color' => $color,
            'light_page_color' => $color,
            'light_surface_color' => $color,
            'light_muted_color' => $color,
            'light_text_color' => $color,
            'light_border_color' => $color,
            'dark_page_color' => $color,
            'dark_surface_color' => $color,
            'dark_muted_color' => $color,
            'dark_text_color' => $color,
            'dark_border_color' => $color,
            'nav_background_color' => $color,
            'nav_panel_color' => $color,
            'nav_text_color' => $color,
            'body_font' => ['required', Rule::in(array_keys(SiteAppearance::FONT_OPTIONS))],
            'display_font' => ['required', Rule::in(array_keys(SiteAppearance::FONT_OPTIONS))],
            'light_logo' => ['nullable', File::image()->types(['png', 'jpg', 'jpeg', 'webp'])->max(5 * 1024)],
            'dark_logo' => ['nullable', File::image()->types(['png', 'jpg', 'jpeg', 'webp'])->max(5 * 1024)],
        ];
    }

    protected function prepareForValidation(): void
    {
        $colors = collect($this->all())
            ->filter(fn (mixed $value, string $key) => str_ends_with($key, '_color') && is_string($value))
            ->map(fn (string $value) => strtoupper(trim($value)))
            ->all();

        $this->merge($colors);
    }
}
