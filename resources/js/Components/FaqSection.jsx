import FaqItem from './FaqItem';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { useI18n } from '../i18n/I18nContext';

export default function FaqSection() {
    const { t } = useI18n();
    const questions = t('faq.items');

    return (
        <section
            className="scroll-mt-24 border-b-2 border-border bg-page py-16 text-foreground min-[901px]:py-[88px]"
            id="faq"
        >
            <div className="mx-auto max-w-[1120px] px-6">
                <SectionHeading eyebrow={t('faq.eyebrow')} title={t('faq.title')} />

                <Reveal>
                    {questions.map((item) => (
                        <FaqItem
                            answer={item.answer}
                            key={item.question}
                            question={item.question}
                        />
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
