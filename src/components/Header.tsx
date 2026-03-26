"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import AuthModal from './AuthModal';
import ProfileSetup from './ProfileSetup';

export default function Header() {
    const pathname = usePathname();
    const t = useTranslations('header');
    const locale = useLocale();

    // ロケールプレフィックスを除いた純粋なパスを取得
    const cleanPath = pathname.replace(/^\/(en|ja|zh-TW|ko|pt-BR|de|fr|es|it|th)/, '') || '/';

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value;
        const newPath = newLocale === 'ja' ? cleanPath : `/${newLocale}${cleanPath === '/' ? '' : cleanPath}`;
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
        window.location.href = newPath;
    };

    const [session, setSession] = useState<any>(null);
    const [profile, setProfile] = useState<{ nickname: string, avatar_url: string | null } | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileSetup, setShowProfileSetup] = useState(false);

    useEffect(() => {
        const { supabase } = require('../lib/supabaseClient');
        supabase.auth.getSession().then(({ data: { session } }: any) => {
            setSession(session);
            if (session) fetchProfile(session.user.id, supabase);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setSession(session);
            if (session) fetchProfile(session.user.id, supabase);
            else setProfile(null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, supabaseClient: any) => {
        const { data } = await supabaseClient
            .from('profiles')
            .select('nickname, avatar_url')
            .eq('id', userId)
            .single();
        if (data) setProfile(data);
    };

    const handleLogout = async () => {
        const { supabase } = require('../lib/supabaseClient');
        await supabase.auth.signOut();
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
                {cleanPath !== '/codes' && <Link href="/codes" className="y2k-nav-btn">{t('codes')}</Link>}
                {cleanPath !== '/bbs' && <Link href="/bbs" className="y2k-nav-btn">{t('bbs')}</Link>}
                
                {/* ログイン関係のUI */}
                {!session ? (
                    <button onClick={() => setShowAuthModal(true)} className="y2k-nav-btn" style={{ background: '#ffefd5', color: '#8b4513' }}>
                        ログイン
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                            onClick={() => setShowProfileSetup(true)}
                            title="プロフィール設定"
                            style={{
                                width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#eee',
                                overflow: 'hidden', cursor: 'pointer', border: '2px solid var(--accent-color)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '1.2rem' }}>👤</span>
                            )}
                        </div>
                        <button onClick={handleLogout} className="y2k-nav-btn" style={{ padding: '2px 8px', fontSize: '0.8rem', background: '#ffe4e1', color: '#8b0000' }}>
                            ログアウト
                        </button>
                    </div>
                )}

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
                        <option value="pt-BR">🇧🇷 Português</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="it">🇮🇹 Italiano</option>
                        <option value="th">🇹🇭 ภาษาไทย</option>
                    </select>
                )}
            </nav>

            {/* モーダル */}
            {showAuthModal && (
                <AuthModal 
                    onClose={() => setShowAuthModal(false)} 
                    onAuthSuccess={() => { setShowAuthModal(false); setShowProfileSetup(true); }} 
                />
            )}
            {showProfileSetup && session && (
                <ProfileSetup 
                    userId={session.user.id} 
                    onClose={() => setShowProfileSetup(false)} 
                    onProfileUpdated={() => {
                        const { supabase } = require('../lib/supabaseClient');
                        fetchProfile(session.user.id, supabase);
                    }} 
                />
            )}
        </header>
    );
}
