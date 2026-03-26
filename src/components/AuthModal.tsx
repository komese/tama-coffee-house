"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '../lib/supabaseClient';

export default function AuthModal({ onClose, onAuthSuccess }: { onClose: () => void, onAuthSuccess?: () => void }) {
    const t = useTranslations('auth');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);



    const handleGoogleLogin = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (error: any) {
            setErrorMsg(error.message || t('errorAuth'));
            setLoading(false);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="y2k-window" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px' }}>
                <div className="y2k-window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{t('login')}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#333' }}>×</button>
                </div>
                <div className="y2k-window-body">
                    {errorMsg && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{errorMsg}</div>}
                    
                    <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem', color: '#555' }}>
                        投稿やプロフィール設定を行うにはログインしてください。
                    </div>

                    <button 
                        type="button" 
                        onClick={handleGoogleLogin} 
                        className="y2k-button" 
                        disabled={loading} 
                        style={{ width: '100%', background: '#fff', color: '#444', border: '2px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google でログイン
                    </button>
                </div>
            </div>
        </div>
    );
}
