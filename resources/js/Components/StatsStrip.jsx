import Reveal from './Reveal';
import { useI18n } from '../i18n/I18nContext';

export default function StatsStrip() {
    const { t } = useI18n();
    const stats = t('stats.items');

    return (
        <section
            aria-label={t('stats.aria')}
            className="border-b-2 border-border bg-surface-muted py-0 text-foreground"
        >
            <div className="mx-auto grid max-w-[1120px] grid-cols-2 px-6 min-[901px]:grid-cols-4">
                {stats.map(({ value, description }, index) => (
                    <Reveal
                        className={`border-t border-border-soft px-[22px] py-[30px] min-[901px]:border-t-0 ${
                            index % 2 === 1 ? 'border-s-2 border-s-border' : ''
                        } ${
                            index > 0
                                ? 'min-[901px]:border-s-2 min-[901px]:border-s-border'
                                : ''
                        }`}
                        delay={index * 80}
                        key={value}
                    >
                        <p className="font-[Archivo] text-[clamp(28px,3.4vw,42px)] leading-none font-black tracking-[-0.02em]">
                            {value}
                        </p>
                        <p className="mt-2 font-['IBM_Plex_Mono'] text-[12.5px] leading-[1.55] text-copy-muted">
                            {description}
                        </p>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
