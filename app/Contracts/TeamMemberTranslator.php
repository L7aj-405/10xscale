<?php

namespace App\Contracts;

interface TeamMemberTranslator
{
    /**
     * @param  array{name: string, role: string, bio: string, photo_label?: string|null}  $fields
     * @return array<string, array<string, string>>
     */
    public function translate(array $fields): array;
}
