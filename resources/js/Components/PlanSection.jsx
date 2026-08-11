import Highlight from './Highlight';
import MonthCard from './MonthCard';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { useI18n } from '../i18n/I18nContext';

export default function PlanSection() {
    const { t } = useI18n();
    const months = t('plan.months').map((month, monthIndex) => ({
        ...month,
        items: month.items.map((text, itemIndex) => ({
            highlighted: monthIndex === 2 && itemIndex === month.items.length - 1,
            text,
        })),
    }));

    return (
        <section
            className="scroll-mt-24 border-b-2 border-border bg-surface-muted py-16 text-foreground min-[901px]:py-[88px]"
            id="plan"
        >
            <div className="mx-auto max-w-[1120px] px-6">
                <SectionHeading
                    eyebrow={t('plan.eyebrow')}
                    title={
                        <>
                            {t('plan.titleBefore')}
                            <Highlight>{t('plan.titleHighlight')}</Highlight>
                        </>
                    }
                />

                <Reveal className="grid grid-cols-1 overflow-hidden rounded-[10px] border-2 border-border bg-surface min-[901px]:grid-cols-3">
                    {months.map((month, index) => (
                        <MonthCard
                            index={index}
                            items={month.items}
                            key={month.tag}
                            tag={month.tag}
                            title={month.title}
                        />
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
