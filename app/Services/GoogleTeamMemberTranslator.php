<?php

namespace App\Services;

use App\Contracts\TeamMemberTranslator;
use App\Exceptions\TeamMemberTranslationException;
use Illuminate\Support\Facades\Cache;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Throwable;

class GoogleTeamMemberTranslator implements TeamMemberTranslator
{
    private const TARGET_LANGUAGES = ['fr', 'ar'];

    public function translate(array $fields): array
    {
        try {
            return collect($fields)
                ->mapWithKeys(fn (?string $text, string $field) => [
                    $field => $this->translateField(trim((string) $text)),
                ])
                ->all();
        } catch (Throwable $exception) {
            report($exception);

            throw new TeamMemberTranslationException(
                'Automatic translation is temporarily unavailable. Please try saving again.',
                previous: $exception,
            );
        }
    }

    /**
     * @return array<string, string>
     */
    private function translateField(string $text): array
    {
        if ($text === '') {
            return ['en' => '', 'fr' => '', 'ar' => ''];
        }

        $translations = ['en' => $text];

        foreach (self::TARGET_LANGUAGES as $language) {
            $translations[$language] = Cache::rememberForever(
                'team-member-translation:'.hash('sha256', "en:{$language}:{$text}"),
                fn () => $this->translateText($text, $language),
            );
        }

        return $translations;
    }

    private function translateText(string $text, string $targetLanguage): string
    {
        $translated = (new GoogleTranslate(
            target: $targetLanguage,
            source: 'en',
            options: ['connect_timeout' => 5, 'timeout' => 12],
        ))->translate($text);

        if (! is_string($translated) || trim($translated) === '') {
            throw new TeamMemberTranslationException(
                "No {$targetLanguage} translation was returned for the supplied text.",
            );
        }

        return trim($translated);
    }
}
