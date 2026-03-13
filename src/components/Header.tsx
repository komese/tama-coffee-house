"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function Header() {
    const pathname = usePathname();
    const t = useTranslations('header');
    const locale = useLocale();

    // ロケールプレフィックスを除いた純粋なパスを取得
    const cleanPath = pathname.replace(/^\/(en|ja)/, '') || '/';

    // 言語切替用のリンク先
    const switchLocale = locale === 'ja' ? 'en' : 'ja';
    const switchPath = switchLocale === 'ja' ? cleanPath : `/en${cleanPath === '/' ? '' : cleanPath}`;

    return (
        <header className="y2k-header">
            <div style={{
                fontSize: '1.6rem',
                fontWeight: '900',
                color: 'var(--primary-color)',
                fontFamily: 'var(--font-main)',
                letterSpacing: '1px'
            }}>
                <Link href="/" style={{ color: 'var(--primary-color)' }}>{t('siteName')}</Link>
            </div>
            <nav className="header-nav">
                {cleanPath !== '/' && <Link href="/" className="y2k-nav-btn">{t('home')}</Link>}
                {cleanPath !== '/simulator' && <Link href="/simulator" className="y2k-nav-btn">{t('simulator')}</Link>}
                {!cleanPath.startsWith('/evolution') && <Link href="/#evolution" className="y2k-nav-btn">{t('evolution')}</Link>}
                {cleanPath !== '/family-tree' && <Link href="/family-tree" className="y2k-nav-btn">{t('familyTree')}</Link>}
                {cleanPath !== '/bbs' && <Link href="/bbs" className="y2k-nav-btn">{t('bbs')}</Link>}
                <a 
                    href={switchPath}
                    className="y2k-nav-btn" 
                    style={{ 
                        fontSize: '0.85rem', 
                        padding: '4px 10px', 
                        backgroundColor: 'var(--primary-color)', 
                        color: '#fff',
                        borderColor: 'var(--primary-color)'
                    }}
                >
                    {locale === 'ja' ? '🇬🇧 EN' : '🇯🇵 JA'}
                </a>
            </nav>
        </header>
    );
}
