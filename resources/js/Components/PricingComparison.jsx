import Highlight from './Highlight';
import Reveal from './Reveal';
import { useI18n } from '../i18n/I18nContext';

function PriceCell({ children, index, label, note, value }) {
    return (
        <div
            className={`p-[26px] ${
                index > 0
                    ? 'border-t-2 border-border min-[901px]:border-t-0 min-[901px]:border-s-2'
                    : ''
            }`}
        >
            <p className="font-['IBM_Plex_Mono'] text-xs tracking-[0.1em] text-copy-muted uppercase">
                {label}
            </p>
            <div className="mt-1.5 font-[Archivo] text-[30px] leading-[1.2] font-black tracking-[-0.02em]">
                {children ?? value}
            </div>
            <p className="mt-1.5 font-['IBM_Plex_Mono'] text-[12.5px] leading-[1.55] text-copy-subtle">
                {note}
            </p>
        </div>
    );
}

export default function PricingComparison() {
    const { t } = useI18n();
    const pricing = [
        { label: t('pricing.typical'), value: t('pricing.typicalValue'), note: t('pricing.typicalNote') },
        { label: t('pricing.retainer'), value: t('pricing.retainerValue'), note: t('pricing.retainerNote') },
    ];

    return (
        <Reveal
            aria-label={t('pricing.aria')}
            className="mt-11 grid grid-cols-1 overflow-hidden rounded-[10px] border-2 border-border bg-surface min-[901px]:grid-cols-3"
        >
            {pricing.map((price, index) => (
                <PriceCell
                    index={index}
                    key={price.label}
                    label={price.label}
                    note={price.note}
                    value={price.value}
                />
            ))}

            <PriceCell
                index={2}
                label={t('pricing.setup')}
                note={t('pricing.setupNote')}
            >
                <s className="me-2 text-xl font-semibold text-footer-muted">$1,500</s>{' '}
                <Highlight>$0</Highlight>
            </PriceCell>
        </Reveal>
    );
}
