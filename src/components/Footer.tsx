"use client";

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
    const t = useTranslations('footer');
    const locale = useLocale();
    return (
        <footer style={{
            backgroundColor: 'var(--primary-color)',
            padding: '20px',
            marginTop: 'auto',
            borderTop: '4px solid var(--accent-color)',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#fffaf0',
            fontFamily: 'var(--font-retro)'
        }}>
            <p style={{ marginBottom: '10px', fontSize: '1.2em' }}>
                {t('title')}
            </p>

            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '12px',
                border: '1px solid var(--accent-color)',
                borderRadius: '8px',
                display: 'inline-block',
                maxWidth: '600px',
                fontSize: '0.85rem',
                color: '#ececec',
                fontFamily: 'var(--font-main)'
            }}>
                <strong style={{ color: '#fdf6e3' }}>{t('disclaimer')}</strong><br />
                {t('disclaimerText')}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Link prefetch={false} href={`/${locale}/feedback`} style={{ color: '#ccc', fontSize: '0.85rem', textDecoration: 'underline' }}>
                    管理人への目安箱（ご意見・ご要望）
                </Link>
                <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                    &copy; {new Date().getFullYear()} Tama Coffee House. All rights reserved. (Unofficial)
                </p>
            </div>
        </footer>
    );
}
