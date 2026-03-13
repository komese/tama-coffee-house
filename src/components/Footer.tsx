"use client";

import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');
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

            <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#666' }}>
                &copy; {new Date().getFullYear()} Tama Coffee House. All rights reserved. (Unofficial)
            </p>
        </footer>
    );
}
