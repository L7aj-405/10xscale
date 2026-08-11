import FitColumn from './FitColumn';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { useI18n } from '../i18n/I18nContext';

export default function FitSection() {
    const { t } = useI18n();

    return (
        <section className="border-b-2 border-border bg-surface-muted py-16 text-foreground min-[901px]:py-[88px]">
            <div className="mx-auto max-w-[1120px] px-6">
                <SectionHeading
                    eyebrow={t('fit.eyebrow')}
                    title={t('fit.title')}
                />

                <div className="grid grid-cols-1 gap-[22px] min-[901px]:grid-cols-2">
                    <FitColumn items={t('fit.yesItems')} title={t('fit.yesTitle')} />
                    <FitColumn
                        delay={80}
                        items={t('fit.noItems')}
                        title={t('fit.noTitle')}
                        variant="no"
                    />
                </div>

                <Reveal
                    as="p"
                    className="mt-[22px] font-['IBM_Plex_Mono'] text-[13px] leading-[1.55] text-copy-muted"
                >
                    {t('fit.note')}
                </Reveal>
            </div>
        </section>
    );
}
