import { Head } from '@inertiajs/react';
import AuditSection from '../Components/AuditSection';
import BrandMarquee from '../Components/BrandMarquee';
import CaseStudiesSection from '../Components/CaseStudiesSection';
import FaqSection from '../Components/FaqSection';
import FitSection from '../Components/FitSection';
import Footer from '../Components/Footer';
import GuaranteeSection from '../Components/GuaranteeSection';
import HeroSection from '../Components/HeroSection';
import Navigation from '../Components/Navigation';
import PlanSection from '../Components/PlanSection';
import ProblemSection from '../Components/ProblemSection';
import ProcessSection from '../Components/ProcessSection';
import StatsStrip from '../Components/StatsStrip';
import TeamSection from '../Components/TeamSection';
import { useI18n } from '../i18n/I18nContext';

export default function Landing({ brandLogos = [] }) {
    const { t } = useI18n();

    return (
        <>
            <Head title={t('meta.title')}>
                <meta
                    content={t('meta.description')}
                    name="description"
                />
            </Head>

            <Navigation />

            <main>
                <HeroSection />
                <BrandMarquee brands={brandLogos} />
                <StatsStrip />
                <ProblemSection />
                <PlanSection />
                <GuaranteeSection />
                <CaseStudiesSection />
                <FitSection />
                <ProcessSection />
                <TeamSection />
                <FaqSection />
                <AuditSection />
            </main>

            <Footer />
        </>
    );
}
