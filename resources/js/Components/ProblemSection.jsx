import Highlight from './Highlight';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { useI18n } from '../i18n/I18nContext';

export default function ProblemSection() {
    const { t } = useI18n();

    return (
        <section
            className="scroll-mt-24 border-b-2 border-border bg-page py-16 text-foreground min-[901px]:py-[88px]"
            id="problem"
        >
            <div className="mx-auto max-w-[1120px] px-6">
                <SectionHeading
                    eyebrow={t('problem.eyebrow')}
                    title={t('problem.title')}
                />

                <div className="grid grid-cols-1 items-start gap-10 min-[901px]:grid-cols-2 min-[901px]:gap-14">
                    <Reveal className="text-[17px] leading-[1.55] text-copy-strong">
                        <p className="mb-4">
                            {t('problem.p1')}
                        </p>

                        <p className="mb-4">
                            {t('problem.p2BeforeCurrent')}
                            <strong>{t('problem.current')}</strong>
                            {t('problem.p2BeforeGoal')}
                            <strong>
                                <Highlight>{t('problem.goal')}</Highlight>
                            </strong>
                            .
                        </p>

                        <p>
                            {t('problem.p3')}
                        </p>
                    </Reveal>

                    <Reveal delay={100}>
                        <blockquote className="rounded-[10px] border-2 border-border bg-marker p-[26px] font-[Archivo] text-[19px] leading-[1.35] font-bold text-marker-ink shadow-[10px_10px_0_#0B0B0B]">
                            {t('problem.quote')}
                            <cite className="mt-3.5 block font-['IBM_Plex_Mono'] text-[12.5px] leading-[1.55] font-medium tracking-[0.06em] text-marker-ink not-italic">
                                {t('problem.cite')}
                            </cite>
                        </blockquote>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
