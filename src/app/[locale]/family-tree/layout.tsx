import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata' });
    return {
        title: t('familyTreeTitle'),
        description: t('familyTreeDescription'),
        openGraph: {
            title: t('familyTreeTitle'),
            description: t('familyTreeDescription'),
            images: [{ url: '/images/og/og-family-tree.png', width: 1024, height: 640 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('familyTreeTitle'),
            description: t('familyTreeDescription'),
            images: ['/images/og/og-family-tree.png'],
        },
    };
}

export default function FamilyTreeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
