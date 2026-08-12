import { useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import Highlight from './Highlight';
import SectionHeading from './SectionHeading';
import TeamCard from './TeamCard';

const carouselCopy = {
    en: { aria: 'Meet the team carousel', empty: 'Team profiles are coming soon.', next: 'Next team member', previous: 'Previous team member' },
    fr: { aria: 'Carrousel de notre équipe', empty: 'Les profils de l’équipe arrivent bientôt.', next: 'Membre suivant', previous: 'Membre précédent' },
    ar: { aria: 'عارض فريق العمل', empty: 'ستتوفر ملفات أعضاء الفريق قريباً.', next: 'عضو الفريق التالي', previous: 'عضو الفريق السابق' },
};

export default function TeamSection({ teamMembers = [] }) {
    const { direction, language, t } = useI18n();
    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const copy = carouselCopy[language] ?? carouselCopy.en;

    const scrollToIndex = (nextIndex) => {
        if (!teamMembers.length) return;

        const normalizedIndex = Math.min(Math.max(nextIndex, 0), teamMembers.length - 1);
        const slide = trackRef.current?.querySelector(`[data-team-slide="${normalizedIndex}"]`);

        if (slide && trackRef.current) {
            const track = trackRef.current;
            const left = slide.offsetLeft - ((track.clientWidth - slide.clientWidth) / 2);

            track.scrollTo({ behavior: 'smooth', left });
        }
        setActiveIndex(normalizedIndex);
    };

    const syncActiveSlide = () => {
        const track = trackRef.current;
        if (!track) return;

        const trackCenter = track.getBoundingClientRect().left + (track.clientWidth / 2);
        const slides = [...track.querySelectorAll('[data-team-slide]')];
        const closest = slides.reduce((best, slide, index) => {
            const box = slide.getBoundingClientRect();
            const distance = Math.abs((box.left + (box.width / 2)) - trackCenter);
            return distance < best.distance ? { distance, index } : best;
        }, { distance: Number.POSITIVE_INFINITY, index: 0 });

        setActiveIndex(closest.index);
    };

    return (
        <section className="scroll-mt-24 border-b-2 border-border bg-page py-[72px] min-[901px]:py-[96px]" id="team">
            <div className="mx-auto max-w-[1120px] px-6">
                <div className="flex flex-col gap-6 min-[760px]:flex-row min-[760px]:items-end min-[760px]:justify-between">
                    <SectionHeading
                        description={t('team.description')}
                        eyebrow={t('team.eyebrow')}
                        title={<>{t('team.titleBefore')}<Highlight>{t('team.titleHighlight')}</Highlight></>}
                    />

                    {teamMembers.length > 1 ? (
                        <div className="mb-7 flex shrink-0 gap-2" dir={direction}>
                            <CarouselButton disabled={activeIndex === 0} label={copy.previous} onClick={() => scrollToIndex(activeIndex - 1)}>
                                <ArrowIcon className={`size-5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                            </CarouselButton>
                            <CarouselButton disabled={activeIndex === teamMembers.length - 1} label={copy.next} onClick={() => scrollToIndex(activeIndex + 1)}>
                                <ArrowIcon className={`size-5 ${direction === 'ltr' ? 'rotate-180' : ''}`} />
                            </CarouselButton>
                        </div>
                    ) : null}
                </div>

                {teamMembers.length ? (
                    <>
                        <div
                            aria-label={copy.aria}
                            className="-mx-6 flex snap-x snap-mandatory gap-[18px] overflow-x-auto px-6 pb-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            dir="ltr"
                            onScroll={syncActiveSlide}
                            ref={trackRef}
                            role="region"
                        >
                            {teamMembers.map((member, index) => (
                                <div className="h-auto min-w-0 shrink-0 basis-full snap-start min-[560px]:basis-[calc((100%-18px)/2)] min-[901px]:basis-[calc((100%-36px)/3)]" data-team-slide={index} dir={direction} key={member.id}>
                                    <TeamCard language={language} member={member} />
                                </div>
                            ))}
                        </div>

                        <div aria-hidden="true" className="mt-3 flex justify-center gap-2">
                            {teamMembers.map((member, index) => (
                                <span className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-foreground' : 'w-1.5 bg-border-soft'}`} key={member.id} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-xl border-2 border-dashed border-border-soft bg-surface-muted px-6 py-14 text-center text-copy-muted">{copy.empty}</div>
                )}
            </div>
        </section>
    );
}

function CarouselButton({ children, disabled, label, onClick }) {
    return (
        <button aria-label={label} className="grid size-11 cursor-pointer place-items-center rounded-full border-2 border-border bg-surface text-foreground transition-colors hover:bg-foreground hover:text-page disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-surface disabled:hover:text-foreground" disabled={disabled} onClick={onClick} type="button">
            {children}
        </button>
    );
}

function ArrowIcon({ className }) {
    return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
