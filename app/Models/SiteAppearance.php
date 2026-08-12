<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class SiteAppearance extends Model
{
    public const FONT_OPTIONS = [
        'instrument-sans' => 'Instrument Sans',
        'archivo' => 'Archivo',
        'inter' => 'Inter',
        'manrope' => 'Manrope',
        'space-grotesk' => 'Space Grotesk',
    ];

    public const DEFAULTS = [
        'accent_color' => '#FFE81A',
        'accent_text_color' => '#0B0B0B',
        'danger_color' => '#D92D20',
        'light_page_color' => '#FFFFFF',
        'light_surface_color' => '#FFFFFF',
        'light_muted_color' => '#F1EFE9',
        'light_text_color' => '#0B0B0B',
        'light_border_color' => '#0B0B0B',
        'dark_page_color' => '#0C0C0D',
        'dark_surface_color' => '#161618',
        'dark_muted_color' => '#202024',
        'dark_text_color' => '#F7F7F2',
        'dark_border_color' => '#EFEFE9',
        'nav_background_color' => '#0B0B0B',
        'nav_panel_color' => '#1C1C1C',
        'nav_text_color' => '#FFFFFF',
        'body_font' => 'instrument-sans',
        'display_font' => 'archivo',
        'logo_height_mobile' => 30,
        'logo_height_desktop' => 42,
        'logo_height_admin' => 48,
        'light_logo_path' => null,
        'dark_logo_path' => null,
    ];

    protected $fillable = [
        'accent_color',
        'accent_text_color',
        'danger_color',
        'light_page_color',
        'light_surface_color',
        'light_muted_color',
        'light_text_color',
        'light_border_color',
        'dark_page_color',
        'dark_surface_color',
        'dark_muted_color',
        'dark_text_color',
        'dark_border_color',
        'nav_background_color',
        'nav_panel_color',
        'nav_text_color',
        'body_font',
        'display_font',
        'logo_height_mobile',
        'logo_height_desktop',
        'logo_height_admin',
        'light_logo_path',
        'dark_logo_path',
    ];

    /**
     * @return array<string, int|string|null>
     */
    public static function current(): array
    {
        if (! Schema::hasTable('site_appearances')) {
            return self::DEFAULTS;
        }

        $appearance = static::query()->find(1);

        return array_replace(
            self::DEFAULTS,
            $appearance?->only(array_keys(self::DEFAULTS)) ?? [],
        );
    }

    /**
     * Return browser-safe appearance settings with versioned logo URLs.
     *
     * @return array<string, bool|int|string|null>
     */
    public static function shared(): array
    {
        $appearance = self::current();
        $hasLightLogo = filled($appearance['light_logo_path']);
        $hasDarkLogo = filled($appearance['dark_logo_path']);
        $hasLogo = $hasLightLogo || $hasDarkLogo;
        $version = Schema::hasTable('site_appearances')
            ? static::query()->find(1)?->updated_at?->getTimestamp()
            : null;

        unset($appearance['light_logo_path'], $appearance['dark_logo_path']);

        $logoUrl = function (string $mode) use ($hasLogo, $version): ?string {
            if (! $hasLogo) {
                return null;
            }

            $url = route('site-appearance.logo', ['mode' => $mode], absolute: false);

            return $version ? $url.'?v='.$version : $url;
        };

        return [
            ...$appearance,
            'has_light_logo' => $hasLightLogo,
            'has_dark_logo' => $hasDarkLogo,
            'light_logo_url' => $logoUrl('light'),
            'dark_logo_url' => $logoUrl('dark'),
        ];
    }
}
