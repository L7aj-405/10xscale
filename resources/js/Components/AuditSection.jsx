import AuditForm from './AuditForm';
import { useI18n } from '../i18n/I18nContext';

export default function AuditSection() {
    const { t } = useI18n();

    return (
        <section
            className="scroll-mt-24 bg-nav py-20 text-on-nav min-[901px]:py-[100px]"
            id="audit"
        >
            <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-start gap-10 px-6 min-[901px]:grid-cols-[1fr_1.05fr] min-[901px]:gap-16">
                <div>
                    <span className="inline-flex items-center gap-2.5 font-['IBM_Plex_Mono'] text-[10.5px] font-semibold tracking-[0.08em] text-marker uppercase before:h-0.5 before:w-[22px] before:bg-marker min-[901px]:text-xs min-[901px]:tracking-[0.14em]">
                        {t('audit.eyebrow')}
                    </span>
                    <h2 className="mt-[18px] max-w-[760px] font-[Archivo] text-[clamp(34px,4.6vw,54px)] leading-[1.04] font-extrabold tracking-[-0.02em] text-balance">
                        {t('audit.title')}
                    </h2>
                    <p className="mt-[18px] max-w-[640px] text-[17.5px] leading-[1.55] text-on-dark-muted">
                        {t('audit.description')}
                    </p>
                    <p className="mt-[22px] max-w-[640px] font-['IBM_Plex_Mono'] text-[12.5px] leading-[1.55] text-footer-muted">
                        {t('audit.availability')}
                    </p>
                </div>

                <AuditForm />
            </div>
        </section>
    );
}
