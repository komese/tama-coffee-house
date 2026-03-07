"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="y2k-header">
            <div style={{
                fontSize: '1.6rem',
                fontWeight: '900',
                color: 'var(--primary-color)',
                fontFamily: 'var(--font-main)',
                letterSpacing: '1px'
            }}>
                <Link href="/" style={{ color: 'var(--primary-color)' }}>☕ たまコーヒーハウス</Link>
            </div>
            <nav style={{ display: 'flex', gap: '15px' }}>
                {pathname !== '/' && <Link href="/" className="y2k-nav-btn">ホーム</Link>}
                {pathname !== '/simulator' && <Link href="/simulator" className="y2k-nav-btn">遺伝シミュ</Link>}
                {!pathname.startsWith('/evolution') && <Link href="/#evolution" className="y2k-nav-btn">進化じょうけん</Link>}
                {pathname !== '/bbs' && <Link href="/bbs" className="y2k-nav-btn">みんなの掲示板</Link>}
            </nav>
        </header>
    );
}
