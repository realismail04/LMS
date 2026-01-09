import React, { lazy, Suspense } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import { Skeleton } from 'antd';

// Static (lightweight) UI components
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';

// Lazy load heavy sections
const HomeHero = lazy(() => import('../components/home/HomeHero'));
const LearningPaths = lazy(() => import('../components/home/LearningPaths'));
const PlatformFeatures = lazy(() => import('../components/home/PlatformFeatures'));
const CertificateSection = lazy(() => import('../components/home/CertificateSection'));
const GamificationPreview = lazy(() => import('../components/home/GamificationPreview'));
const HowItWorks = lazy(() => import('../components/home/HowItWorks'));
const InstructorInvite = lazy(() => import('../components/home/InstructorInvite'));
const FinalCTA = lazy(() => import('../components/home/FinalCTA'));

const SectionLoader = () => (
    <div className="max-w-7xl mx-auto px-4 py-20">
        <Skeleton active paragraph={{ rows: 8 }} />
    </div>
);

const LandingPage = () => {
    usePageTitle('HaxoAcademy | Redefining Digital Learning');

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
            <Navbar />

            <Suspense fallback={<SectionLoader />}>
                <HomeHero />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <PlatformFeatures />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <LearningPaths />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <CertificateSection />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <HowItWorks />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <GamificationPreview />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <InstructorInvite />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <FinalCTA />
            </Suspense>

            <Footer />
        </div>
    );
};

export default LandingPage;
