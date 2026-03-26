import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata' });
    return {
        title: t('simulatorTitle'),
        description: t('simulatorDescription'),
        openGraph: {
            title: t('simulatorTitle'),
            description: t('simulatorDescription'),
            images: [{ url: '/images/og/og-simulator.png', width: 1024, height: 640 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('simulatorTitle'),
            description: t('simulatorDescription'),
            images: ['/images/og/og-simulator.png'],
        },
    };
}

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
