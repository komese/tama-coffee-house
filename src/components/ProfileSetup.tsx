"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import Cropper from 'react-easy-crop';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any,
): Promise<Blob | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/jpeg')
  })
}

export default function ProfileSetup({ userId, onClose, onProfileUpdated }: { userId: string, onClose: () => void, onProfileUpdated?: () => void }) {
    const t = useTranslations('auth');
    const locale = useLocale();
    const [nickname, setNickname] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let fileExt = file.name.split('.').pop()?.toLowerCase() || '';
            let processFile: File | Blob = file;

            if (fileExt === 'heic' || fileExt === 'heif' || file.type === 'image/heic' || file.type === 'image/heif') {
                try {
                    const heic2any = (await import('heic2any')).default;
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 0.8,
                    });
                    processFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                } catch (err) {
                    console.error('HEIC conversion failed', err);
                    setErrorMsg('HEIC画像の変換に失敗しました。別の画像をお試しください。');
                    return;
                }
            }

            setImageSrc(URL.createObjectURL(processFile));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg(null);

        try {
            let finalAvatarUrl = avatarUrl;

            // アップロード処理（クロップされた画像がある場合）
            if (imageSrc && croppedAreaPixels) {
                const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                if (!croppedBlob) throw new Error('Failed to crop image');

                const fileExt = 'jpeg';
                const fileName = `${userId}_${Date.now()}.${fileExt}`;
                const filePath = `public/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, croppedBlob, {
                        contentType: 'image/jpeg',
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

            if (upsertError) {
                if (upsertError.code === '23505') {
                    // PostgreSQLの23505エラーは「一意制約違反（重複）」
                    throw new Error('このニックネームは既に他のログインユーザーに使用されています。別の名前をお試しください。');
                }
                throw upsertError;
            }

            if (onProfileUpdated) onProfileUpdated();
            onClose();

        } catch (error: any) {
            console.error('Profile update error:', error);
            setErrorMsg(error.message || t('errorProfile'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="popup-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="y2k-window" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="y2k-window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{t('profileSetup')}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#333' }}>×</button>
                </div>
                <div className="y2k-window-body">
                    {errorMsg && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{errorMsg}</div>}
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* アバタープレビュー＆クロップ */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            {imageSrc ? (
                                <div style={{ position: 'relative', width: '200px', height: '200px', backgroundColor: '#333', borderRadius: '12px', overflow: 'hidden' }}>
                                    <Cropper
                                        image={imageSrc}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                    />
                                </div>
                            ) : avatarUrl ? (
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '12px', backgroundColor: '#eee',
                                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid var(--accent-color)'
                                }}>
                                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ) : (
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '12px', backgroundColor: '#eee',
                                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid var(--accent-color)'
                                }}>
                                    <span style={{ color: '#aaa', fontSize: '2rem' }}>👤</span>
                                </div>
                            )}

                            {imageSrc && (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                                    <label style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: '5px' }}>ズーム調整</label>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="zoom-range"
                                    />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center' }}>{t('avatar')}</label>
                                <input
                                    type="file"
                                    accept="image/*, .heic, .heif"
                                    onChange={onFileChange}
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
                        <Link href={`/${locale}/account`} className="y2k-button" onClick={onClose} style={{ textAlign: 'center', backgroundColor: '#e6e6fa', color: '#4b0082', marginTop: '10px', textDecoration: 'none', display: 'block' }}>
                            アカウント管理
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
