<?php

namespace App\Http\Controllers;

use App\Actions\StoreAuditRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuditRequestController extends Controller
{
    public function __construct(private readonly StoreAuditRequest $storeAuditRequest) {}

    public function __invoke(Request $request): RedirectResponse
    {
        $locale = in_array($request->input('locale'), ['en', 'fr', 'ar'], true)
            ? $request->input('locale')
            : 'en';

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'country_code' => [
                'required',
                Rule::in(['+44', '+353', '+61', '+64', '+1', '+31', '+45', '+46', '+47', '+358', '+49', 'other']),
            ],
            'phone' => ['required', 'string', 'max:40'],
            'website' => ['required', 'string', 'max:255'],
            'monthly_revenue' => [
                'required',
                Rule::in(['Under $30k', '$30k – $100k', '$100k – $250k', '$250k – $500k', '$500k+']),
            ],
            'list_size' => [
                'required',
                Rule::in(['Under 5,000', '5,000 – 20,000', '20,000 – 50,000', '50,000 – 100,000', '100,000+']),
            ],
            'email_revenue_pct' => [
                'required',
                Rule::in(['I don’t know', 'Under 10%', '10% – 20%', '20% – 30%', 'Over 30%']),
            ],
            'company' => ['nullable', 'max:0'],
            'locale' => ['required', Rule::in(['en', 'fr', 'ar'])],
        ], $this->validationMessages($locale), $this->validationAttributes($locale));

        unset($validated['company'], $validated['locale']);

        $website = trim($validated['website']);

        if (! Str::startsWith($website, ['http://', 'https://'])) {
            $website = 'https://'.$website;
        }

        if (filter_var($website, FILTER_VALIDATE_URL) === false) {
            throw ValidationException::withMessages([
                'website' => match ($locale) {
                    'fr' => 'Veuillez saisir un site de marque valide.',
                    'ar' => 'يرجى إدخال موقع صالح للعلامة التجارية.',
                    default => 'Please enter a valid brand website.',
                },
            ]);
        }

        $validated['website'] = $website;

        $this->storeAuditRequest->handle($validated);

        $firstName = (string) Str::of($validated['name'])->trim()->before(' ');
        $message = $this->successMessage(
            $locale,
            $firstName,
            $validated['monthly_revenue'] === 'Under $30k',
        );

        return to_route('thank-you')->with('audit_success', $message);
    }

    /**
     * @return array<string, string>
     */
    private function validationMessages(string $locale): array
    {
        return match ($locale) {
            'fr' => [
                'required' => 'Le champ :attribute est obligatoire.',
                'email' => 'Veuillez saisir une adresse e-mail valide.',
                'in' => 'La valeur choisie pour :attribute est invalide.',
                'max' => 'Le champ :attribute est trop long.',
            ],
            'ar' => [
                'required' => 'حقل :attribute مطلوب.',
                'email' => 'يرجى إدخال عنوان بريد إلكتروني صالح.',
                'in' => 'القيمة المحددة لحقل :attribute غير صالحة.',
                'max' => 'حقل :attribute أطول من المسموح.',
            ],
            default => [],
        };
    }

    /**
     * @return array<string, string>
     */
    private function validationAttributes(string $locale): array
    {
        return match ($locale) {
            'fr' => [
                'name' => 'nom complet',
                'email' => 'e-mail professionnel',
                'country_code' => 'indicatif pays',
                'phone' => 'téléphone',
                'website' => 'site de la marque',
                'monthly_revenue' => 'chiffre d’affaires mensuel',
                'list_size' => 'taille de la liste',
                'email_revenue_pct' => 'part des revenus e-mail',
            ],
            'ar' => [
                'name' => 'الاسم الكامل',
                'email' => 'بريد العمل',
                'country_code' => 'رمز الدولة',
                'phone' => 'الهاتف',
                'website' => 'موقع العلامة',
                'monthly_revenue' => 'الإيرادات الشهرية',
                'list_size' => 'حجم القائمة',
                'email_revenue_pct' => 'نسبة إيرادات البريد',
            ],
            default => [],
        };
    }

    private function successMessage(string $locale, string $firstName, bool $isBelowThreshold): string
    {
        if ($isBelowThreshold) {
            return match ($locale) {
                'fr' => "Merci, {$firstName} ! Notre accompagnement complet commence à 30 k$/mois, mais nous vous enverrons notre checklist DIY pour corriger vous-même les principales fuites.",
                'ar' => "شكراً {$firstName}! يبدأ برنامجنا المتكامل من 30 ألف دولار شهرياً، لكننا سنرسل لك قائمة التدقيق الذاتية لإصلاح أكبر فجوات الإيرادات.",
                default => "Thanks, {$firstName}! Our done-for-you program starts at $30k/month, but we’ll still send you our DIY audit checklist so you can fix the biggest leaks yourself.",
            };
        }

        return match ($locale) {
            'fr' => "Merci, {$firstName} ! Votre demande est enregistrée. Nous analyserons votre boutique et répondrons sous un jour ouvré avec votre rapport en 15 points.",
            'ar' => "شكراً {$firstName}! تم استلام طلبك. سنراجع متجرك ونرد خلال يوم عمل واحد بتقريرك المكوّن من 15 نقطة.",
            default => "Thanks, {$firstName}! Your audit request is in. We’ll review your store and reply within one business day with your 15-point report.",
        };
    }
}
