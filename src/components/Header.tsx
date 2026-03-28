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

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let mounted = true;
        const fetchUnread = async () => {
            try {
                const saved = localStorage.getItem('tama_bbs_my_posts');
                if (!saved) return;
                const myIds = JSON.parse(saved);
                if (!Array.isArray(myIds) || myIds.length === 0) return;

                const lastCheckedStr = localStorage.getItem('tama_bbs_last_checked');
                // 初回は3日前を基準とする
                const lastChecked = lastCheckedStr ? parseInt(lastCheckedStr, 10) : Date.now() - (3 * 24 * 60 * 60 * 1000);
                const lastCheckedIso = new Date(lastChecked).toISOString();

                const targetTable = locale === 'ja' ? 'messages' : `${locale}_messages`;
                const { supabase } = require('../lib/supabaseClient');

                const { count, error } = await supabase
                    .from(targetTable)
                    .select('*', { count: 'exact', head: true })
                    .in('parent_id', myIds)
                    .gt('created_at', lastCheckedIso);

                if (!error && count !== null && mounted) {
                    setUnreadCount(count);
                }
            } catch (err) {
                console.error('Failed to fetch unread count', err);
            }
        };

        fetchUnread();

        const handleRead = () => { if (mounted) setUnreadCount(0); };
        window.addEventListener('tama_bbs_read', handleRead);
        
        const handleVisibility = () => { if (document.visibilityState === 'visible' && mounted) fetchUnread(); };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            mounted = false;
            window.removeEventListener('tama_bbs_read', handleRead);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [locale]);

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
                <Link prefetch={false} href="/" style={{ color: 'var(--primary-color)' }}>{t('siteName')}</Link>
            </div>
            <nav className="header-nav">
                {cleanPath !== '/' && <Link prefetch={false} href="/" className="y2k-nav-btn">{t('home')}</Link>}
                {cleanPath !== '/simulator' && <Link prefetch={false} href="/simulator" className="y2k-nav-btn">{t('simulator')}</Link>}
                {!cleanPath.startsWith('/evolution') && <Link prefetch={false} href="/#evolution" className="y2k-nav-btn">{t('evolution')}</Link>}
                {cleanPath !== '/family-tree' && <Link prefetch={false} href="/family-tree" className="y2k-nav-btn">{t('familyTree')}</Link>}
                {cleanPath !== '/codes' && <Link prefetch={false} href="/codes" className="y2k-nav-btn">{t('codes')}</Link>}
                {cleanPath !== '/bbs' && <Link prefetch={false} href="/bbs" className="y2k-nav-btn">{t('bbs')}</Link>}
                
                {/* ログイン関係のUI */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!session ? (
                        <button onClick={() => setShowAuthModal(true)} className="y2k-nav-btn" style={{ background: '#ffefd5', color: '#8b4513' }}>
                            ログイン
                        </button>
                    ) : null}

                    {(session || unreadCount > 0) && (
                        <div style={{ position: 'relative' }}>
                            <div 
                                onClick={() => session ? setShowProfileSetup(true) : window.location.assign(`/${locale}/account`)}
                                title="プロフィール設定 / 通知"
                                style={{
                                    width: '30px', height: '30px', borderRadius: '10px', backgroundColor: '#eee',
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
                            
                            {unreadCount > 0 && (
                                <div style={{
                                    position: 'absolute', top: '-4px', right: '-4px',
                                    backgroundColor: '#ff4444', color: 'white',
                                    borderRadius: '50%', minWidth: '18px', height: '18px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)', padding: '0 4px',
                                    pointerEvents: 'none', border: '1px solid white'
                                }}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {session && (
                        <button onClick={handleLogout} className="y2k-nav-btn" style={{ padding: '2px 8px', fontSize: '0.8rem', background: '#ffe4e1', color: '#8b0000' }}>
                            ログアウト
                        </button>
                    )}
                </div>

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
