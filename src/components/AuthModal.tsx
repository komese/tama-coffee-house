"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '../lib/supabaseClient';

export default function AuthModal({ onClose, onAuthSuccess }: { onClose: () => void, onAuthSuccess?: () => void }) {
    const t = useTranslations('auth');
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            }
            if (onAuthSuccess) onAuthSuccess();
            onClose();
        } catch (error: any) {
            setErrorMsg(error.message || t('errorAuth'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="y2k-window" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px' }}>
                <div className="y2k-window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{isLogin ? t('login') : t('signUp')}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#333' }}>×</button>
                </div>
                <div className="y2k-window-body">
                    {errorMsg && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{errorMsg}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('email')}</label>
                            <input
                                type="email"
                                className="y2k-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('password')}</label>
                            <input
                                type="password"
                                className="y2k-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="y2k-button" disabled={loading} style={{ marginTop: '10px' }}>
                            {loading ? '...' : isLogin ? t('submitLogin') : t('submitSignUp')}
                        </button>
                    </form>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button
                            onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            {isLogin ? t('toggleSignUp') : t('toggleLogin')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
