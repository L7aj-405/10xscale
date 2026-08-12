<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->posts() as $position => $post) {
            BlogPost::query()->updateOrCreate(
                ['slug' => $post['slug']],
                [
                    ...$post,
                    'position' => $position,
                    'author' => '10Xscale Team',
                    'published_at' => now()->subDays(($position + 1) * 7),
                    'is_published' => true,
                ],
            );
        }
    }

    private function posts(): array
    {
        return [
            $this->post(
                'how-much-revenue-should-klaviyo-generate',
                ['en' => 'How Much Revenue Should Klaviyo Generate for Your Store?', 'fr' => 'Combien de revenus Klaviyo devrait-il générer pour votre boutique ?', 'ar' => 'ما حجم الإيرادات التي يجب أن يحققها Klaviyo لمتجرك؟'],
                ['en' => 'Learn the key benchmarks behind email-attributed revenue and how to spot the gap between your current setup and a healthy retention engine.', 'fr' => 'Découvrez les repères des revenus attribués à l’e-mail et identifiez l’écart entre votre configuration et un moteur de rétention sain.', 'ar' => 'تعرّف على معايير الإيرادات المنسوبة للبريد وكيف تكتشف الفجوة بين إعدادك الحالي ومحرك احتفاظ صحي.'],
                ['en' => 'Email strategy', 'fr' => 'Stratégie e-mail', 'ar' => 'استراتيجية البريد'],
                ['en' => 'Revenue benchmarks', 'fr' => 'Repères de revenus', 'ar' => 'معايير الإيرادات'],
                8,
            ),
            $this->post(
                'eight-klaviyo-flows-growing-shopify-brands-need',
                ['en' => 'The 8 Klaviyo Flows Every Growing Shopify Brand Needs', 'fr' => 'Les 8 scénarios Klaviyo indispensables à toute marque Shopify en croissance', 'ar' => 'تدفقات Klaviyo الثمانية التي تحتاجها كل علامة Shopify نامية'],
                ['en' => 'A practical lifecycle map covering welcome, browse, cart, post-purchase, win-back and the automations that turn first orders into repeat revenue.', 'fr' => 'Une carte pratique du cycle client : bienvenue, navigation, panier, après-achat, réactivation et automatisations de réachat.', 'ar' => 'خريطة عملية لدورة العميل تشمل الترحيب والتصفح والسلة وما بعد الشراء والاستعادة وتحويل الطلب الأول إلى إيراد متكرر.'],
                ['en' => 'Automation', 'fr' => 'Automatisation', 'ar' => 'الأتمتة'],
                ['en' => 'Klaviyo flows', 'fr' => 'Scénarios Klaviyo', 'ar' => 'تدفقات Klaviyo'],
                10,
            ),
            $this->post(
                'good-open-rates-can-hide-deliverability-problems',
                ['en' => 'Why Good Open Rates Can Still Hide a Deliverability Problem', 'fr' => 'Pourquoi de bons taux d’ouverture peuvent cacher un problème de délivrabilité', 'ar' => 'لماذا قد تخفي معدلات الفتح الجيدة مشكلة في قابلية التسليم'],
                ['en' => 'Open rates alone do not tell the full story. Discover the signals that reveal inbox placement, list quality and sender-reputation issues.', 'fr' => 'Les taux d’ouverture ne disent pas tout. Découvrez les signaux liés au placement, à la qualité de liste et à la réputation.', 'ar' => 'معدلات الفتح لا تروي القصة كاملة. اكتشف مؤشرات الوصول إلى صندوق الوارد وجودة القائمة وسمعة المرسل.'],
                ['en' => 'Deliverability', 'fr' => 'Délivrabilité', 'ar' => 'قابلية التسليم'],
                ['en' => 'Deliverability', 'fr' => 'Délivrabilité', 'ar' => 'قابلية التسليم'],
                7,
            ),
            $this->post(
                'increase-repeat-purchases-without-constant-discounts',
                ['en' => 'How to Increase Repeat Purchases Without Constant Discounts', 'fr' => 'Comment augmenter les achats répétés sans remises permanentes', 'ar' => 'كيفية زيادة عمليات الشراء المتكررة دون خصومات دائمة'],
                ['en' => 'Build better post-purchase education, replenishment timing and customer segments so repeat sales grow without training buyers to wait for a sale.', 'fr' => 'Améliorez l’après-achat, le timing de réapprovisionnement et les segments sans habituer vos clients aux promotions.', 'ar' => 'حسّن التثقيف بعد الشراء وتوقيت التجديد والشرائح لتنمية المبيعات المتكررة دون تعويد العملاء على انتظار التخفيضات.'],
                ['en' => 'Retention', 'fr' => 'Rétention', 'ar' => 'الاحتفاظ'],
                ['en' => 'Customer retention', 'fr' => 'Rétention client', 'ar' => 'الاحتفاظ بالعملاء'],
                9,
            ),
            $this->post(
                'campaigns-vs-flows-ecommerce-email-revenue',
                ['en' => 'Campaigns vs. Flows: Where Ecommerce Email Revenue Really Comes From', 'fr' => 'Campagnes ou scénarios : d’où viennent vraiment les revenus e-mail ?', 'ar' => 'الحملات أم التدفقات: من أين تأتي إيرادات البريد فعلاً؟'],
                ['en' => 'Understand the role of automated lifecycle messages and planned campaigns—and how to balance both for consistent, measurable growth.', 'fr' => 'Comprenez le rôle des messages automatisés et des campagnes planifiées, puis équilibrez-les pour une croissance mesurable.', 'ar' => 'افهم دور رسائل دورة الحياة الآلية والحملات المخططة وكيف توازن بينهما لتحقيق نمو ثابت وقابل للقياس.'],
                ['en' => 'Growth systems', 'fr' => 'Systèmes de croissance', 'ar' => 'أنظمة النمو'],
                ['en' => 'Campaigns vs flows', 'fr' => 'Campagnes vs scénarios', 'ar' => 'الحملات مقابل التدفقات'],
                6,
            ),
        ];
    }

    private function post(string $slug, array $title, array $excerpt, array $category, array $visual, int $minutes): array
    {
        return [
            'slug' => $slug,
            'title' => $title,
            'excerpt' => $excerpt,
            'content' => [
                'en' => $excerpt['en']."\n\nA strong retention program starts with clean measurement, clear customer segments and messages built around the moments that change buying behaviour. Review the underlying customer journey before adding more campaigns or automations.\n\nUse this framework as a practical starting point, then test one meaningful variable at a time. Track revenue, conversion, unsubscribe behaviour and repeat purchase rate together so short-term wins do not hide long-term damage.",
                'fr' => $excerpt['fr']."\n\nUn programme de rétention solide commence par une mesure fiable, des segments clients clairs et des messages adaptés aux moments qui influencent l’achat. Analysez le parcours client avant d’ajouter des campagnes ou des automatisations.\n\nUtilisez ce cadre comme point de départ, puis testez une variable importante à la fois. Suivez ensemble les revenus, la conversion, les désabonnements et le taux de réachat.",
                'ar' => $excerpt['ar']."\n\nيبدأ برنامج الاحتفاظ القوي بقياس دقيق وشرائح عملاء واضحة ورسائل مبنية حول اللحظات التي تغيّر سلوك الشراء. راجع رحلة العميل الأساسية قبل إضافة المزيد من الحملات أو التدفقات الآلية.\n\nاستخدم هذا الإطار كنقطة بداية عملية، ثم اختبر متغيراً مهماً واحداً في كل مرة. تابع الإيرادات والتحويل وإلغاء الاشتراك ومعدل الشراء المتكرر معاً.",
            ],
            'category' => $category,
            'visual' => $visual,
            'cover_label' => [
                'en' => $title['en'].' article cover',
                'fr' => 'Couverture de l’article '.$title['fr'],
                'ar' => 'غلاف مقال '.$title['ar'],
            ],
            'reading_minutes' => $minutes,
        ];
    }
}
