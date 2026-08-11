import GuaranteeCard from './GuaranteeCard';
import Highlight from './Highlight';
import PricingComparison from './PricingComparison';
import SectionHeading from './SectionHeading';
import { useI18n } from '../i18n/I18nContext';

export default function GuaranteeSection() {
    const { t } = useI18n();
    const guarantees = t('guarantee.terms');

    return (
        <section
            className="scroll-mt-24 border-b-2 border-border bg-page py-16 text-foreground min-[901px]:py-[88px]"
            id="guarantee"
        >
            <div className="mx-auto max-w-[1120px] px-6">
                <SectionHeading
                    eyebrow={t('guarantee.eyebrow')}
                    title={
                        <>
                            {t('guarantee.titleBefore')}
                            <Highlight>{t('guarantee.titleHighlight')}</Highlight>
                        </>
                    }
                />

                <div className="grid grid-cols-1 gap-[22px] min-[901px]:grid-cols-2">
                    {guarantees.map((guarantee, index) => (
                        <GuaranteeCard
                            delay={(index % 2) * 80}
                            description={guarantee.description}
                            key={guarantee.term}
                            term={guarantee.term}
                            title={guarantee.title}
                        />
                    ))}
                </div>

                <PricingComparison />
            </div>
        </section>
    );
}
