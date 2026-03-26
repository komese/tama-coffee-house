"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '../lib/supabaseClient';

export default function ProfileSetup({ userId, onClose, onProfileUpdated }: { userId: string, onClose: () => void, onProfileUpdated?: () => void }) {
    const t = useTranslations('auth');
    const [nickname, setNickname] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('nickname, avatar_url')
                .eq('id', userId)
                .single();

            if (data) {
                setNickname(data.nickname || '');
                setAvatarUrl(data.avatar_url || null);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [userId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg(null);

        try {
            let finalAvatarUrl = avatarUrl;

            // アップロード処理
            if (avatarFile) {
                let uploadFile: File | Blob = avatarFile;
                let fileExt = avatarFile.name.split('.').pop()?.toLowerCase() || '';

                // HEIC変換（必要なら）
                if (fileExt === 'heic' || fileExt === 'heif' || avatarFile.type === 'image/heic' || avatarFile.type === 'image/heif') {
                    const heic2any = (await import('heic2any')).default;
                    const convertedBlob = await heic2any({
                        blob: avatarFile,
                        toType: 'image/jpeg',
                        quality: 0.8,
                    });
                    uploadFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                    fileExt = 'jpeg';
                }

                const fileName = `${userId}_${Date.now()}.${fileExt}`;
                const filePath = `public/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, uploadFile, {
                        contentType: fileExt === 'jpeg' ? 'image/jpeg' : avatarFile.type,
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                finalAvatarUrl = publicUrlData.publicUrl;
            }

            // プロフィールDB更新（UPSERT）
            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({ id: userId, nickname: nickname.trim(), avatar_url: finalAvatarUrl });

            if (upsertError) throw upsertError;

            if (onProfileUpdated) onProfileUpdated();
            onClose();

        } catch (error: any) {
            console.error('Profile update error:', error);
            setErrorMsg(t('errorProfile'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="popup-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="y2k-window" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px' }}>
                <div className="y2k-window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{t('profileSetup')}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#333' }}>×</button>
                </div>
                <div className="y2k-window-body">
                    {errorMsg && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{errorMsg}</div>}
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* アバタープレビュー */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee',
                                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid var(--accent-color)'
                            }}>
                                {avatarFile ? (
                                    <img src={URL.createObjectURL(avatarFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: '#aaa', fontSize: '2rem' }}>👤</span>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center' }}>{t('avatar')}</label>
                                <input
                                    type="file"
                                    accept="image/*, .heic, .heif"
                                    onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                                    style={{ fontSize: '0.9rem', width: '200px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('nickname')} <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                className="y2k-input"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                required
                                maxLength={20}
                            />
                        </div>
                        
                        <button type="submit" className="y2k-button" disabled={saving || !nickname.trim()} style={{ marginTop: '10px' }}>
                            {saving ? t('saving') : t('save')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
