<?php

namespace App\Support;

class VideoEmbedUrl
{
    public static function from(?string $url): ?string
    {
        if (! $url || ! filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        $host = preg_replace('/^www\./', '', $host);
        $path = trim((string) parse_url($url, PHP_URL_PATH), '/');

        if ($host === 'youtu.be') {
            return self::youtube(explode('/', $path)[0] ?? null);
        }

        if (in_array($host, ['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'], true)) {
            parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
            $segments = explode('/', $path);
            $videoId = $query['v'] ?? (in_array($segments[0] ?? null, ['embed', 'shorts', 'live'], true) ? ($segments[1] ?? null) : null);

            return self::youtube(is_string($videoId) ? $videoId : null);
        }

        if (in_array($host, ['vimeo.com', 'player.vimeo.com'], true)) {
            if (preg_match('/(?:video\/)?(\d+)/', $path, $matches)) {
                return 'https://player.vimeo.com/video/'.$matches[1];
            }
        }

        return null;
    }

    private static function youtube(?string $videoId): ?string
    {
        if (! $videoId || ! preg_match('/^[A-Za-z0-9_-]{6,}$/', $videoId)) {
            return null;
        }

        return 'https://www.youtube-nocookie.com/embed/'.$videoId;
    }
}
