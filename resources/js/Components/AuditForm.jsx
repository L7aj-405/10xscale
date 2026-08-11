import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';

const countryCodes = [
    ['+44', '🇬🇧 +44'],
    ['+353', '🇮🇪 +353'],
    ['+61', '🇦🇺 +61'],
    ['+64', '🇳🇿 +64'],
    ['+1', '🇨🇦 +1'],
    ['+31', '🇳🇱 +31'],
    ['+45', '🇩🇰 +45'],
    ['+46', '🇸🇪 +46'],
    ['+47', '🇳🇴 +47'],
    ['+358', '🇫🇮 +358'],
    ['+49', '🇩🇪 +49'],
    ['other', '🌍 Other'],
];

const revenueValues = ['Under $30k', '$30k – $100k', '$100k – $250k', '$250k – $500k', '$500k+'];
const listValues = ['Under 5,000', '5,000 – 20,000', '20,000 – 50,000', '50,000 – 100,000', '100,000+'];
const percentageValues = ['I don’t know', 'Under 10%', '10% – 20%', '20% – 30%', 'Over 30%'];

const controlClass =
    'w-full rounded-xl border-2 border-border bg-surface px-3.5 py-[13px] text-[15px] text-foreground outline-none focus:ring-3 focus:ring-marker focus:ring-offset-1 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60';

function FieldError({ id, message }) {
    return message ? (
        <p className="mt-1.5 text-sm font-medium text-leak" id={id}>
            {message}
        </p>
    ) : null;
}

function FieldLabel({ children, htmlFor }) {
    return (
        <label
            className="mb-1.5 block font-['IBM_Plex_Mono'] text-[11.5px] font-semibold tracking-[0.08em] text-copy-muted uppercase"
            htmlFor={htmlFor}
        >
            {children}
        </label>
    );
}

export default function AuditForm() {
    const { flash = {}, routes = {} } = usePage().props;
    const { language, t } = useI18n();
    const form = useForm({
        name: '',
        email: '',
        country_code: '+44',
        phone: '',
        website: '',
        monthly_revenue: '',
        list_size: '',
        email_revenue_pct: '',
        company: '',
        locale: language,
    });
    const {
        data,
        errors,
        processing,
        setData,
        wasSuccessful,
    } = form;

    useEffect(() => {
        setData('locale', language);
    }, [language]);

    const submit = (event) => {
        event.preventDefault();

        form.post(routes.auditRequestsStore ?? '/audit-requests', {
            preserveScroll: false,
            onError: (submissionErrors) => {
                const firstInvalidField = Object.keys(submissionErrors)[0];
                const field = document.querySelector(`[name="${firstInvalidField}"]`);

                field?.focus();
            },
        });
    };

    return (
        <form
            className="rounded-[20px] bg-surface p-6 text-foreground shadow-[0_14px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 min-[600px]:p-[34px]"
            onSubmit={submit}
        >
            <h3 className="mb-1.5 font-[Archivo] text-[22px] leading-[1.04] font-extrabold tracking-[-0.02em]">
                {t('audit.formTitle')}
            </h3>
            <p className="mb-6 font-['IBM_Plex_Mono'] text-[12.5px] text-copy-subtle">
                {t('audit.formSub')}
            </p>

            <div
                aria-hidden="true"
                className="absolute -start-[9999px] h-px w-px overflow-hidden"
            >
                <label htmlFor="company">{t('audit.companyFax')}</label>
                <input
                    autoComplete="off"
                    id="company"
                    name="company"
                    onChange={(event) => setData('company', event.target.value)}
                    tabIndex="-1"
                    type="text"
                    value={data.company}
                />
            </div>

            <div className="grid grid-cols-1 gap-x-3.5 min-[600px]:grid-cols-2">
                <div className="mb-3.5">
                    <FieldLabel htmlFor="audit-name">{t('audit.name')}</FieldLabel>
                    <input
                        aria-describedby={errors.name ? 'audit-name-error' : undefined}
                        aria-invalid={Boolean(errors.name)}
                        autoComplete="name"
                        className={controlClass}
                        disabled={processing || wasSuccessful}
                        dir="auto"
                        id="audit-name"
                        name="name"
                        onChange={(event) => setData('name', event.target.value)}
                        placeholder={t('audit.namePlaceholder')}
                        required
                        type="text"
                        value={data.name}
                    />
                    <FieldError id="audit-name-error" message={errors.name} />
                </div>

                <div className="mb-3.5">
                    <FieldLabel htmlFor="audit-email">{t('audit.email')}</FieldLabel>
                    <input
                        aria-describedby={errors.email ? 'audit-email-error' : undefined}
                        aria-invalid={Boolean(errors.email)}
                        autoComplete="email"
                        className={controlClass}
                        disabled={processing || wasSuccessful}
                        dir="ltr"
                        id="audit-email"
                        name="email"
                        onChange={(event) => setData('email', event.target.value)}
                        placeholder={t('audit.emailPlaceholder')}
                        required
                        type="email"
                        value={data.email}
                    />
                    <FieldError id="audit-email-error" message={errors.email} />
                </div>
            </div>

            <div className="mb-3.5">
                <FieldLabel htmlFor="audit-phone">{t('audit.phone')}</FieldLabel>
                <div className="grid grid-cols-[118px_1fr] gap-2.5 min-[480px]:grid-cols-[130px_1fr]">
                    <select
                        aria-label={t('audit.countryCode')}
                        className={controlClass}
                        disabled={processing || wasSuccessful}
                        dir="ltr"
                        name="country_code"
                        onChange={(event) => setData('country_code', event.target.value)}
                        value={data.country_code}
                    >
                        {countryCodes.map(([value, label]) => (
                            <option key={value} value={value}>
                                {value === 'other' ? `🌍 ${t('audit.otherCountry')}` : label}
                            </option>
                        ))}
                    </select>
                    <input
                        aria-describedby={errors.phone ? 'audit-phone-error' : undefined}
                        aria-invalid={Boolean(errors.phone)}
                        autoComplete="tel"
                        className={controlClass}
                        disabled={processing || wasSuccessful}
                        dir="ltr"
                        id="audit-phone"
                        inputMode="tel"
                        name="phone"
                        onChange={(event) => setData('phone', event.target.value)}
                        placeholder="7911 123456"
                        required
                        type="tel"
                        value={data.phone}
                    />
                </div>
                <FieldError
                    id="audit-phone-error"
                    message={errors.phone || errors.country_code}
                />
            </div>

            <div className="mb-3.5">
                <FieldLabel htmlFor="audit-website">{t('audit.website')}</FieldLabel>
                <input
                    aria-describedby={errors.website ? 'audit-website-error' : undefined}
                    aria-invalid={Boolean(errors.website)}
                    autoComplete="url"
                    className={controlClass}
                    disabled={processing || wasSuccessful}
                    dir="ltr"
                    id="audit-website"
                    inputMode="url"
                    name="website"
                    onChange={(event) => setData('website', event.target.value)}
                    placeholder={t('audit.websitePlaceholder')}
                    required
                    type="text"
                    value={data.website}
                />
                <FieldError id="audit-website-error" message={errors.website} />
            </div>

            <div className="grid grid-cols-1 gap-x-3.5 min-[600px]:grid-cols-2">
                <div className="mb-3.5">
                    <FieldLabel htmlFor="audit-revenue">{t('audit.revenue')}</FieldLabel>
                    <select
                        aria-describedby={errors.monthly_revenue ? 'audit-revenue-error' : undefined}
                        aria-invalid={Boolean(errors.monthly_revenue)}
                        className={controlClass}
                        disabled={processing || wasSuccessful}
                        id="audit-revenue"
                        name="monthly_revenue"
                        onChange={(event) => setData('monthly_revenue', event.target.value)}
                        required
                        value={data.monthly_revenue}
                    >
                        <option disabled value="">{t('audit.selectRange')}</option>
                        {revenueValues.map((value, index) => (
                            <option key={value} value={value}>{t('audit.revenueOptions')[index]}</option>
                        ))}
                    </select>
                    <FieldError id="audit-revenue-error" message={errors.monthly_revenue} />
                </div>

                <div className="mb-3.5">
                    <FieldLabel htmlFor="audit-list">{t('audit.listSize')}</FieldLabel>
                    <select
                        aria-describedby={errors.list_size ? 'audit-list-error' : undefined}
                        aria-invalid={Boolean(errors.list_size)}
                        className={controlClass}
                        disabled={processing || wasSuccessful}
                        id="audit-list"
                        name="list_size"
                        onChange={(event) => setData('list_size', event.target.value)}
                        required
                        value={data.list_size}
                    >
                        <option disabled value="">{t('audit.selectRange')}</option>
                        {listValues.map((value, index) => (
                            <option key={value} value={value}>{t('audit.listOptions')[index]}</option>
                        ))}
                    </select>
                    <FieldError id="audit-list-error" message={errors.list_size} />
                </div>
            </div>

            <div className="mb-3.5">
                <FieldLabel htmlFor="audit-percentage">
                    {t('audit.percentage')}
                </FieldLabel>
                <select
                    aria-describedby={errors.email_revenue_pct ? 'audit-percentage-error' : undefined}
                    aria-invalid={Boolean(errors.email_revenue_pct)}
                    className={controlClass}
                    disabled={processing || wasSuccessful}
                    id="audit-percentage"
                    name="email_revenue_pct"
                    onChange={(event) => setData('email_revenue_pct', event.target.value)}
                    required
                    value={data.email_revenue_pct}
                >
                    <option disabled value="">{t('audit.selectGuess')}</option>
                    {percentageValues.map((value, index) => (
                        <option key={value} value={value}>{t('audit.percentageOptions')[index]}</option>
                    ))}
                </select>
                <FieldError
                    id="audit-percentage-error"
                    message={errors.email_revenue_pct}
                />
            </div>

            <button
                className="mt-2 w-full cursor-pointer rounded-full bg-foreground p-4 font-[Archivo] text-[16.5px] font-extrabold text-page transition-colors hover:bg-marker hover:text-marker-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-leak disabled:cursor-not-allowed disabled:bg-copy-muted disabled:text-page"
                disabled={processing || wasSuccessful}
                type="submit"
            >
                {processing
                    ? t('audit.sending')
                    : wasSuccessful
                      ? t('audit.received')
                      : t('audit.submit')}
            </button>

            <p className="mt-3 text-center font-['IBM_Plex_Mono'] text-[11.5px] leading-[1.55] text-copy-faint">
                {t('audit.note')}
            </p>

            {flash.audit_success ? (
                <div
                    className="mt-3.5 rounded-xl border-2 border-border bg-marker p-4 text-[14.5px] leading-[1.55] text-marker-ink"
                    role="status"
                >
                    {flash.audit_success}
                </div>
            ) : null}
        </form>
    );
}
