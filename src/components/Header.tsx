"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function Header() {
    const pathname = usePathname();
    const t = useTranslations('header');
    const locale = useLocale();

    // ロケールプレフィックスを除いた純粋なパスを取得
    const cleanPath = pathname.replace(/^\/(en|ja|zh-TW|ko)/, '') || '/';

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value;
        const newPath = newLocale === 'ja' ? cleanPath : `/${newLocale}${cleanPath === '/' ? '' : cleanPath}`;
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
        window.location.href = newPath;
    };

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
                {cleanPath !== '/bbs' && (
                    <select
                        value={locale}
                        onChange={handleLanguageChange}
                        className="y2k-nav-btn"
                        style={{
                            fontSize: '0.85rem',
                            padding: '4px 20px 4px 10px',
                            backgroundColor: 'var(--primary-color)',
                            color: '#fff',
                            borderColor: 'var(--primary-color)',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="ja">🇯🇵 日本語</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="zh-TW">🇹🇼/🇭🇰 繁體中文</option>
                        <option value="ko">🇰🇷 한국어</option>
                    </select>
                )}
            </nav>
        </header>
    );
}
