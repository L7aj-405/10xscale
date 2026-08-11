import { useEffect, useState } from 'react';
import useInView from '../hooks/useInView';
import { useI18n } from '../i18n/I18nContext';

const revenueBars = [
    {
        key: 'before',
        labelKey: 'meter.before',
        target: 18,
        width: '38%',
    },
    {
        key: 'after',
        labelKey: 'meter.after',
        target: 32,
        width: '72%',
    },
];

export default function RevenueMeter() {
    const { elementRef, isInView } = useInView({ threshold: 0.4 });
    const { t } = useI18n();
    const [values, setValues] = useState({ before: 0, after: 0 });

    useEffect(() => {
        if (!isInView) {
            return undefined;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValues({ before: 18, after: 32 });
            return undefined;
        }

        let animationFrame;
        let startedAt;

        const animate = (timestamp) => {
            startedAt ??= timestamp;

            const progress = Math.min((timestamp - startedAt) / 1300, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setValues({
                before: Math.round(18 * easedProgress),
                after: Math.round(32 * easedProgress),
            });

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(animate);
            }
        };

        animationFrame = window.requestAnimationFrame(animate);

        return () => window.cancelAnimationFrame(animationFrame);
    }, [isInView]);

    return (
        <div
            aria-label={t('meter.aria')}
            className={`rounded-[10px] border-2 border-border bg-surface p-5 [--meter-shadow:#F1EFE9] shadow-[10px_10px_0_var(--meter-shadow)] transition-[opacity,transform] duration-[600ms] ease-out dark:[--meter-shadow:#000000] min-[480px]:p-7 ${
                isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-[18px] opacity-0'
            }`}
            ref={elementRef}
            role="img"
        >
            <div className="mb-[22px] flex justify-between gap-4 font-['IBM_Plex_Mono'] text-[11px] leading-tight tracking-[0.12em] uppercase min-[480px]:text-xs">
                <span>{t('meter.title')}</span>
                <span className="text-end whitespace-nowrap">{t('meter.period')}</span>
            </div>

            {revenueBars.map(({ key, labelKey, target, width }) => {
                const isBefore = key === 'before';

                return (
                    <div className="mb-5" key={key}>
                        <div className="mb-[7px] flex justify-between gap-4 font-['IBM_Plex_Mono'] text-xs min-[480px]:text-[13px]">
                            <span>{t(labelKey).toUpperCase()}</span>
                            <span
                                className={`font-[Archivo] font-black ${
                                    isBefore ? 'text-leak' : 'text-foreground'
                                }`}
                            >
                                {values[key] ?? target}%
                            </span>
                        </div>

                        <div className="relative h-[34px] overflow-hidden rounded-[7px] border-2 border-border bg-surface">
                            <div
                                className={`h-full transition-[width] duration-[1400ms] ease-[cubic-bezier(.6,0,.2,1)] motion-reduce:transition-none ${
                                    isBefore ? '' : 'bg-foreground'
                                }`}
                                style={{
                                    backgroundImage: isBefore
                                        ? 'repeating-linear-gradient(-45deg, #D92D20, #D92D20 6px, var(--color-surface) 6px, var(--color-surface) 12px)'
                                        : undefined,
                                    width: isInView ? width : 0,
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            <div className="border-t-2 border-border pt-4 font-['IBM_Plex_Mono'] text-xs leading-relaxed min-[480px]:text-[13.5px]">
                {t('meter.gap')}{' '}
                <strong className="text-[15px] min-[480px]:text-[17px]">
                    {t('meter.value')}
                </strong>
            </div>
        </div>
    );
}
