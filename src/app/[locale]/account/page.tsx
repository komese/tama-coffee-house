"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import Cropper from 'react-easy-crop';
import { LAND_DATA, SEA_DATA, SKY_DATA, FOREST_DATA } from '@/data/evolutionData';

// MUSHROOM_DATAが存在するか不明なため、確実に存在する4つを利用
const allCharacters = [
    ...LAND_DATA, ...SEA_DATA, ...SKY_DATA, ...FOREST_DATA
].filter((char, index, self) => 
    index === self.findIndex((t) => (t.iconUrl === char.iconUrl)) // 重複排除
);

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
    image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  )
  return new Promise((resolve) => {
    canvas.toBlob((blob) => { resolve(blob) }, 'image/jpeg')
  })
}

export default function AccountPage() {
    const tAuth = useTranslations('auth');
    const tBbs = useTranslations('bbs');
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string || 'ja';

    const [session, setSession] = useState<any>(null);
    const [nickname, setNickname] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // AuthModal State
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Cropper State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Tamagotchi Picker State
    const [showPicker, setShowPicker] = useState(false);

    // Replies State
    const [replies, setReplies] = useState<any[]>([]);

    useEffect(() => {
        const fetchAll = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (!currentSession) {
                setShowAuthModal(true);
                setLoading(false);
                return;
            }
            setSession(currentSession);

            // Fetch Profile
            const { data: profile } = await supabase.from('profiles').select('nickname, avatar_url').eq('id', currentSession.user.id).single();
            if (profile) {
                setNickname(profile.nickname || '');
                setAvatarUrl(profile.avatar_url || null);
            }

            // Fetch Replies
            const tableMap: Record<string, string> = {
                ja: 'messages', en: 'en_messages', 'zh-TW': 'zh_tw_messages', ko: 'ko_messages',
                'pt-BR': 'pt_br_messages', de: 'de_messages', fr: 'fr_messages',
                es: 'es_messages', it: 'it_messages', th: 'th_messages'
            };
            const targetTable = tableMap[locale] || 'messages';

            const { data: myData } = await supabase.from(targetTable).select('id').eq('author_id', currentSession.user.id);
            let existingIds: string[] = [];
            if (myData && myData.length > 0) {
                existingIds = myData.map(d => d.id);
            }
            
            // ゲスト時代の投稿も統合する
            try {
                const local = localStorage.getItem('tama_bbs_my_posts');
                if (local) {
                    const localIds = JSON.parse(local);
                    if (Array.isArray(localIds)) {
                        existingIds = Array.from(new Set([...existingIds, ...localIds]));
                    }
                }
            } catch(e) { console.error(e); }

            let allReplies: any[] = [];

            if (existingIds.length > 0) {
                const { data: fetchReplies } = await supabase
                    .from(targetTable)
                    .select('id, content, author_name, created_at, parent_id, author_id, author_avatar_url')
                    .in('parent_id', existingIds)
                    .order('created_at', { ascending: false });

                if (fetchReplies) {
                    allReplies = [...fetchReplies];
                }

                // 通知バッジを消す（既読にする）
                localStorage.setItem('tama_bbs_last_checked', Date.now().toString());
                window.dispatchEvent(new Event('tama_bbs_read'));
            }

            // 目安箱の管理人返信を取得
            const { data: adminReplies } = await supabase
                .from('feedbacks')
                .select('id, content, admin_reply, admin_replied_at')
                .eq('author_id', currentSession.user.id)
                .not('admin_reply', 'is', null);

            if (adminReplies && adminReplies.length > 0) {
                const formattedAdminReplies = adminReplies.map(r => ({
                    id: `feedback_${r.id}`,
                    content: r.admin_reply,
                    original_content: r.content,
                    author_name: '管理人',
                    is_admin_reply: true,
                    created_at: r.admin_replied_at || new Date().toISOString()
                }));
                allReplies = [...allReplies, ...formattedAdminReplies];
            }

            // 日付で降順にソート（新しいものが上）
            allReplies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            
            setReplies(allReplies);
            
            setLoading(false);
        };
        fetchAll();
    }, [locale, router]);

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
                    const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
                    processFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                } catch (err) {
                    setErrorMsg('HEIC画像の変換に失敗しました。');
                    return;
                }
            }
            setImageSrc(URL.createObjectURL(processFile));
            setShowPicker(false); // hide picker if active
        }
    };

    const handleSelectTamagotchi = (url: string) => {
        setAvatarUrl(url);
        setImageSrc(null); // Clear cropper
        setShowPicker(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            let finalAvatarUrl = avatarUrl;
            if (imageSrc && croppedAreaPixels) {
                const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                if (!croppedBlob) throw new Error('Failed to crop image');
                const fileName = `${session.user.id}_${Date.now()}.jpeg`;
                const { error: uploadError } = await supabase.storage.from('avatars').upload(`public/${fileName}`, croppedBlob, { contentType: 'image/jpeg', upsert: true });
                if (uploadError) throw uploadError;
                const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(`public/${fileName}`);
                finalAvatarUrl = publicUrlData.publicUrl;
                setAvatarUrl(finalAvatarUrl);
                setImageSrc(null);
            }

            const { error: upsertError } = await supabase.from('profiles').upsert({ id: session.user.id, nickname: nickname.trim(), avatar_url: finalAvatarUrl });
            if (upsertError) {
                if (upsertError.code === '23505') throw new Error('このニックネームは既に他のユーザーに使用されています。');
                throw upsertError;
            }
            setSuccessMsg('プロフィールを更新しました！');
        } catch (error: any) {
            setErrorMsg(error.message || tAuth('errorProfile'));
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    if (!session) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
                {showAuthModal && (
                    <AuthModal 
                        onClose={() => router.push(`/${locale}`)} 
                        onAuthSuccess={() => window.location.reload()} 
                    />
                )}
            </div>
        );
    }

    return (
        <div className="y2k-container" style={{ maxWidth: '800px', margin: '30px auto 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1 className="y2k-title" style={{ textAlign: 'center' }}>アカウント管理</h1>

            {/* Profile Window */}
            <div className="y2k-window">
                <div className="y2k-window-header">プロフィール設定</div>
                <div className="y2k-window-body">
                    {errorMsg && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{errorMsg}</div>}
                    {successMsg && <div style={{ color: 'green', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>{successMsg}</div>}
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            {imageSrc ? (
                                <div style={{ position: 'relative', width: '200px', height: '200px', backgroundColor: '#333', borderRadius: '12px', overflow: 'hidden' }}>
                                    <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                                </div>
                            ) : avatarUrl ? (
                                <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--accent-color)', backgroundColor: '#eee' }}>
                                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ) : (
                                <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--accent-color)', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#aaa', fontSize: '2.5rem' }}>👤</span>
                                </div>
                            )}

                            {imageSrc && (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                                    <label style={{ fontSize: '0.8rem', textAlign: 'center' }}>ズーム調整</label>
                                    <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <div>
                                    <label htmlFor="avatar-upload" className="y2k-button" style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '0.8rem', display: 'inline-block' }}>
                                        ファイルを選択
                                    </label>
                                    <input id="avatar-upload" type="file" accept="image/*, .heic, .heif" onChange={onFileChange} style={{ display: 'none' }} />
                                </div>
                                <button type="button" onClick={() => setShowPicker(!showPicker)} className="y2k-button" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                                    たまごっち一覧から選ぶ
                                </button>
                            </div>
                            
                            {showPicker && (
                                <div style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {allCharacters.map(char => (
                                        <img 
                                            key={char.id} src={char.iconUrl} alt={char.name} title={char.name}
                                            onClick={() => handleSelectTamagotchi(char.iconUrl)}
                                            style={{ width: '40px', height: '40px', cursor: 'pointer', border: '1px solid transparent', borderRadius: '8px' }}
                                            onMouseOver={(e) => e.currentTarget.style.border = '1px solid var(--primary-color)'}
                                            onMouseOut={(e) => e.currentTarget.style.border = '1px solid transparent'}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{tAuth('nickname')} <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" className="y2k-input" value={nickname} onChange={(e) => setNickname(e.target.value)} required maxLength={20} />
                        </div>
                        
                        <button type="submit" className="y2k-button" disabled={saving || !nickname.trim()} style={{ marginTop: '10px' }}>
                            {saving ? tAuth('saving') : tAuth('save')}
                        </button>
                    </form>
                </div>
            </div>

            {/* Replies Window */}
            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">自分への返信一覧</div>
                <div className="y2k-window-body" style={{ padding: '10px' }}>
                    {replies.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>まだ返信はありません</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {replies.map(reply => (
                                <div key={reply.id} style={{ border: reply.is_admin_reply ? '2px solid #0288d1' : '1px solid #ccc', padding: '10px', borderRadius: '8px', backgroundColor: reply.is_admin_reply ? '#e1f5fe' : '#fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                                        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {reply.is_admin_reply ? (
                                                <span style={{ color: '#0277bd' }}>管理人からのお返事</span>
                                            ) : (
                                                <>{reply.author_name} さんからの返信</>
                                            )}
                                        </div>
                                        <span style={{ color: '#888' }}>{formatDate(reply.created_at)}</span>
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem', color: reply.is_admin_reply ? '#01579b' : 'inherit' }}>{reply.content}</div>
                                    {reply.is_admin_reply && reply.original_content && (
                                        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666', borderTop: '1px dashed #81d4fa', paddingTop: '8px' }}>
                                            <strong>あなたが送った目安箱：</strong><br />
                                            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'inline-block', marginTop: '4px' }}>{reply.original_content}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
