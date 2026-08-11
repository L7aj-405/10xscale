import ProcessStep from './ProcessStep';
import SectionHeading from './SectionHeading';
import { useI18n } from '../i18n/I18nContext';

export default function ProcessSection() {
    const { t } = useI18n();
    const steps = t('process.steps');

    return (
        <section className="border-b-2 border-border bg-page py-16 text-foreground min-[901px]:py-[88px]">
            <div className="mx-auto max-w-[1120px] px-6">
                <SectionHeading
                    eyebrow={t('process.eyebrow')}
                    title={t('process.title')}
                />

                <div className="grid grid-cols-1 gap-[22px] min-[901px]:grid-cols-3">
                    {steps.map((step, index) => (
                        <ProcessStep
                            delay={index * 80}
                            description={step.description}
                            key={step.title}
                            number={index + 1}
                            title={step.title}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
