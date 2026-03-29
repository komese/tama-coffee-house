import Simulator from '@/components/Simulator';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata' });
    return {
        title: t('simulatorTitle'),
        description: t('simulatorDescription'),
    };
}

export default async function SimulatorPage() {
    const t = await getTranslations('simulator');
    return (
        <main style={{ padding: '20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '20px' }}>
                <Link prefetch={false} href="/" style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'underline' }}>
                    {t('backHome')}
                </Link>
            </div>
            <Simulator />
        </main>
    );
}
