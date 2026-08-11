import { useI18n } from '../i18n/I18nContext';
import Highlight from './Highlight';
import SectionHeading from './SectionHeading';
import TeamCard from './TeamCard';

export default function TeamSection() {
    const { t } = useI18n();

    return (
        <section
            className="scroll-mt-24 border-b-2 border-border bg-page py-[72px] min-[901px]:py-[96px]"
            id="team"
        >
            <div className="mx-auto max-w-[1120px] px-6">
                <SectionHeading
                    description={t('team.description')}
                    eyebrow={t('team.eyebrow')}
                    title={
                        <>
                            {t('team.titleBefore')}
                            <Highlight>{t('team.titleHighlight')}</Highlight>
                        </>
                    }
                />
                <div className="grid grid-cols-1 gap-[18px] min-[560px]:grid-cols-2 min-[901px]:grid-cols-4">
                    {t('team.members').map((member, index) => (
                        <TeamCard key={index} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}
