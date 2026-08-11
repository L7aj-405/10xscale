import { useI18n } from '../i18n/I18nContext';
import CaseStudyCard from './CaseStudyCard';
import Highlight from './Highlight';
import Reveal from './Reveal';

export default function CaseStudiesSection() {
    const { t } = useI18n();
    const caseStudies = t('cases.items');

    return (
        <section
            className="scroll-mt-24 border-b-2 border-border bg-surface-muted py-[72px] min-[901px]:py-[96px]"
            id="case-studies"
        >
            <div className="mx-auto max-w-[1120px] px-6">
                <Reveal className="mb-[34px] flex flex-col gap-5 min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between min-[901px]:gap-7">
                    <div className="max-w-[720px]">
                        <span className="inline-flex items-center gap-2.5 font-['IBM_Plex_Mono'] text-[10.5px] font-semibold tracking-[0.08em] uppercase before:h-0.5 before:w-[22px] before:bg-foreground min-[901px]:text-xs min-[901px]:tracking-[0.14em]">
                            {t('cases.eyebrow')}
                        </span>
                        <h2 className="mt-[18px] font-[Archivo] text-[clamp(30px,4vw,46px)] leading-[1.04] font-extrabold tracking-[-0.02em] text-balance rtl:leading-[1.35]">
                            {t('cases.titleBefore')}
                            <Highlight>{t('cases.titleHighlight')}</Highlight>
                        </h2>
                        <p className="mt-4 text-[17.5px] leading-[1.55] text-copy">
                            {t('cases.description')}
                        </p>
                    </div>
                    <p className="max-w-[350px] font-['IBM_Plex_Mono'] text-[12.5px] text-copy-muted">
                        {t('cases.note')}
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 gap-[22px] min-[760px]:grid-cols-2">
                    {caseStudies.map((caseStudy, index) => (
                        <CaseStudyCard caseStudy={caseStudy} index={index} key={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
