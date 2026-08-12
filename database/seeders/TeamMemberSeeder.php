<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->members() as $member) {
            TeamMember::query()->updateOrCreate(
                ['initials' => $member['initials']],
                $member,
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function members(): array
    {
        return [
            [
                'initials' => 'AB',
                'name' => ['en' => 'Abdelfath Ben Chahyd', 'fr' => 'Abdelfath Ben Chahyd', 'ar' => 'Abdelfath Ben Chahyd'],
                'role' => ['en' => 'Founder & CEO', 'fr' => 'Fondateur & CEO', 'ar' => 'المؤسس والرئيس التنفيذي'],
                'bio' => [
                    'en' => 'Leads growth strategy, client partnerships and the commercial direction behind every 90-day retention sprint.',
                    'fr' => 'Dirige la stratégie de croissance, les partenariats clients et la direction commerciale de chaque sprint de 90 jours.',
                    'ar' => 'يقود استراتيجية النمو وشراكات العملاء والتوجه التجاري لكل خطة احتفاظ مدتها 90 يوماً.',
                ],
                'photo_label' => ['en' => 'ADD CEO PHOTO', 'fr' => 'AJOUTER PHOTO CEO', 'ar' => 'أضف صورة الرئيس'],
                'position' => 0,
                'is_active' => true,
            ],
            [
                'initials' => 'ED',
                'name' => ['en' => 'Team member', 'fr' => 'Membre de l’équipe', 'ar' => 'عضو الفريق'],
                'role' => ['en' => 'Email Designer', 'fr' => 'Designer e-mail', 'ar' => 'مصمم البريد الإلكتروني'],
                'bio' => [
                    'en' => 'Transforms strategy and copy into clear, on-brand emails designed for mobile engagement and conversion.',
                    'fr' => 'Transforme la stratégie et la rédaction en e-mails clairs, fidèles à la marque et conçus pour convertir sur mobile.',
                    'ar' => 'يحوّل الاستراتيجية والنص إلى رسائل واضحة ومتوافقة مع العلامة ومصممة للتفاعل والتحويل عبر الهاتف.',
                ],
                'photo_label' => ['en' => 'ADD TEAM PHOTO', 'fr' => 'AJOUTER PHOTO', 'ar' => 'أضف صورة الفريق'],
                'position' => 10,
                'is_active' => true,
            ],
            [
                'initials' => 'KB',
                'name' => ['en' => 'Team member', 'fr' => 'Membre de l’équipe', 'ar' => 'عضو الفريق'],
                'role' => ['en' => 'Klaviyo Email Builder', 'fr' => 'Intégrateur Klaviyo', 'ar' => 'منشئ رسائل Klaviyo'],
                'bio' => [
                    'en' => 'Builds flows, segments, tracking logic, testing setups and technically reliable sends inside Klaviyo.',
                    'fr' => 'Construit les scénarios, segments, suivis, tests et envois techniquement fiables dans Klaviyo.',
                    'ar' => 'يبني التدفقات والشرائح ومنطق التتبع وإعدادات الاختبار والإرسال الموثوق داخل Klaviyo.',
                ],
                'photo_label' => ['en' => 'ADD TEAM PHOTO', 'fr' => 'AJOUTER PHOTO', 'ar' => 'أضف صورة الفريق'],
                'position' => 20,
                'is_active' => true,
            ],
            [
                'initials' => 'CD',
                'name' => ['en' => 'Team member', 'fr' => 'Membre de l’équipe', 'ar' => 'عضو الفريق'],
                'role' => ['en' => 'Conversion Email Designer', 'fr' => 'Designer conversion e-mail', 'ar' => 'مصمم بريد للتحويل'],
                'bio' => [
                    'en' => 'Creates campaign and lifecycle designs that balance brand consistency, readability and direct-response performance.',
                    'fr' => 'Crée des campagnes et cycles qui équilibrent cohérence de marque, lisibilité et performance commerciale.',
                    'ar' => 'يصمم الحملات ودورات العميل بموازنة اتساق العلامة والوضوح وأداء الاستجابة المباشرة.',
                ],
                'photo_label' => ['en' => 'ADD TEAM PHOTO', 'fr' => 'AJOUTER PHOTO', 'ar' => 'أضف صورة الفريق'],
                'position' => 30,
                'is_active' => true,
            ],
        ];
    }
}
