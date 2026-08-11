<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'body_font' => ['required', Rule::in(['instrument-sans', 'archivo'])],
            'display_font' => ['required', Rule::in(['archivo', 'instrument-sans'])],
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
