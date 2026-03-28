"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '../../../lib/supabaseClient';
import AuthModal from '@/components/AuthModal';
import { LAND_DATA, SEA_DATA, SKY_DATA, FOREST_DATA } from '@/data/evolutionData';

const allCharacters = [
    ...LAND_DATA, ...SEA_DATA, ...SKY_DATA, ...FOREST_DATA
].filter((char, index, self) =>
    index === self.findIndex((t) => (t.iconUrl === char.iconUrl))
);

const REACTION_EMOJIS = ['👍', '❤️', '🤣', '🤯'] as const;

type Message = {
    id: string | number;
    author_name: string;
    author_id: string | null;
    parent_id?: string | number | null;
    content: string;
    image_url: string | null;
    author_avatar_url?: string | null;
    created_at: string;
    reactions: any;
};

export default function BBS() {
    const t = useTranslations('bbs');
    const locale = useLocale();
    const tableMap: Record<string, string> = {
        ja: 'messages', en: 'en_messages', 'zh-TW': 'zh_tw_messages', ko: 'ko_messages',
        'pt-BR': 'pt_br_messages', de: 'de_messages', fr: 'fr_messages',
        es: 'es_messages', it: 'it_messages', th: 'th_messages'
    };
    const targetTable = tableMap[locale] || 'messages';
    const [messages, setMessages] = useState<any[]>([]);
    const [newName, setNewName] = useState('');
    const [newContent, setNewContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [myMessageIds, setMyMessageIds] = useState<Array<string | number>>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
    const [myReactions, setMyReactions] = useState<Record<string, string[]>>({});
    const [replyTarget, setReplyTarget] = useState<{id: string | number, name: string} | null>(null);
    
    // Guest Icon State
    const DEFAULT_GUEST_ICON = '/images/characters/01_べびまるっち.png';
    const [guestAvatarUrl, setGuestAvatarUrl] = useState<string | null>(DEFAULT_GUEST_ICON);
    const [showPicker, setShowPicker] = useState(false);

    // Auth & Profile states
    const [session, setSession] = useState<any>(null);
    const [myProfile, setMyProfile] = useState<{ nickname: string, avatar_url: string | null } | null>(null);
    const [profilesMap, setProfilesMap] = useState<Record<string, { nickname: string, avatar_url: string | null }>>({});
    const [showAuthModal, setShowAuthModal] = useState(false);

    // LocalStorageから自分のリアクション履歴を復元
    useEffect(() => {
        try {
            const savedReactions = localStorage.getItem('tama_bbs_my_reactions');
            if (savedReactions) {
                setMyReactions(JSON.parse(savedReactions));
            }
        } catch (e) {
            console.error('Failed to parse reactions from local storage', e);
        }
    }, []);

    // 初回マウント時にメッセージを取得＆LocalStorageから自分の投稿IDリストを復元＆既読状態を更新
    useEffect(() => {
        fetchMessages();

        const savedPosts = localStorage.getItem('tama_bbs_my_posts');
        if (savedPosts) {
            setMyMessageIds(JSON.parse(savedPosts));
        }

        // 通知バッジを消す（既読にする）
        localStorage.setItem('tama_bbs_last_checked', Date.now().toString());
        window.dispatchEvent(new Event('tama_bbs_read'));

        // Auth状態の取得
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchMyProfile(session.user.id);
        });

        const authSubscription = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchMyProfile(session.user.id);
            else setMyProfile(null);
        });

        // リアルタイム更新のサブスクリプションを設定
        const subscription = supabase
            .channel(`public:${targetTable}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: targetTable }, payload => {
                setMessages(prev => [payload.new, ...prev]);
                if (payload.new.author_id) fetchMissingProfiles([payload.new.author_id]);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: targetTable }, payload => {
                setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: targetTable }, payload => {
                setMessages(prev => prev.map(msg => msg.id === payload.new.id ? { ...msg, ...payload.new } : msg));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
            authSubscription.data.subscription.unsubscribe();
        };
    }, []);

    const fetchMyProfile = async (userId: string) => {
        const { data } = await supabase.from('profiles').select('nickname, avatar_url').eq('id', userId).single();
        if (data) setMyProfile(data);
    };

    const fetchMissingProfiles = async (authorIds: string[]) => {
        const missingIds = authorIds.filter(id => id && !profilesMap[id]);
        if (missingIds.length === 0) return;

        const { data } = await supabase.from('profiles').select('id, nickname, avatar_url').in('id', missingIds);
        if (data && data.length > 0) {
            setProfilesMap(prev => {
                const newMap = { ...prev };
                data.forEach(p => newMap[p.id] = p);
                return newMap;
            });
        }
    };

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from(targetTable)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching messages:', error);
        } else if (data) {
            setMessages(data);
            const authorIds = Array.from(new Set(data.map(m => m.author_id).filter(id => id)));
            fetchMissingProfiles(authorIds);
        }
        setLoading(false);
    };

    const handleReaction = useCallback(async (msgId: string | number, emoji: string) => {
        // 既にこの絵文字でリアクション済みか確認
        const myReactionsForMsg = myReactions[msgId] || [];
        const alreadyReacted = myReactionsForMsg.includes(emoji);

        // リアクション対象のメッセージを取得
        const msg = messages.find(m => m.id === msgId);
        if (!msg) return;

        const currentReactions = msg.reactions || {};
        const currentCount = currentReactions[emoji] || 0;
        const newCount = alreadyReacted ? Math.max(0, currentCount - 1) : currentCount + 1;

        const updatedReactions = { ...currentReactions, [emoji]: newCount };

        // DB更新
        const { error } = await supabase
            .from(targetTable)
            .update({ reactions: updatedReactions })
            .eq('id', msgId);

        if (error) {
            console.error('Error updating reaction:', error);
            alert('Reaction error: ' + error.message);
            return;
        }

        // ローカルのメッセージリストも更新
        setMessages(prev => prev.map(m =>
            m.id === msgId ? { ...m, reactions: updatedReactions } : m
        ));

        // 自分のリアクション履歴を更新
        setMyReactions(prev => {
            const updated = { ...prev };
            const list = updated[msgId] || [];
            if (alreadyReacted) {
                updated[msgId] = list.filter(e => e !== emoji);
            } else {
                updated[msgId] = [...list, emoji];
            }
            localStorage.setItem('tama_bbs_my_reactions', JSON.stringify(updated));
            return updated;
        });
    }, [messages, myReactions, targetTable]);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // ログイン時はプロフィールの名前を使い、非ログイン時はフォームの名前を使う
        const finalAuthorName = session && myProfile ? myProfile.nickname : newName.trim();
        if (!finalAuthorName || (!newContent.trim() && !imageFile)) return;

        setSaving(true);
        let imageUrl = null;

        // 画像のアップロード処理
        if (imageFile) {
            let uploadFile: File | Blob = imageFile;
            let fileExt = imageFile.name.split('.').pop()?.toLowerCase() || '';

            // HEIC/HEIFの変換処理
            if (fileExt === 'heic' || fileExt === 'heif' || imageFile.type === 'image/heic' || imageFile.type === 'image/heif') {
                try {
                    const heic2any = (await import('heic2any')).default;
                    const convertedBlob = await heic2any({
                        blob: imageFile,
                        toType: 'image/jpeg',
                        quality: 0.8,
                    });
                    uploadFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                    fileExt = 'jpeg';
                } catch (conversionError) {
                    console.error('HEIC conversion error:', conversionError);
                    alert(t('heicError'));
                    setSaving(false);
                    return;
                }
            }

            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('bbs-images')
                .upload(filePath, uploadFile, {
                    contentType: fileExt === 'jpeg' ? 'image/jpeg' : imageFile.type
                });

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                alert(t('uploadError'));
                setSaving(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('bbs-images')
                .getPublicUrl(filePath);

            imageUrl = publicUrlData.publicUrl;
        }

        const finalContent = replyTarget ? `> ${replyTarget.name}さん\n${newContent.trim()}` : newContent.trim();
        const { data, error } = await supabase
            .from(targetTable)
            .insert([
                {
                    author_name: finalAuthorName,
                    author_id: session ? session.user.id : null,
                    author_avatar_url: session ? null : guestAvatarUrl,
                    parent_id: replyTarget ? replyTarget.id : null,
                    content: finalContent,
                    image_url: imageUrl,
                    delete_password: null,
                    reactions: {}
                }
            ])
            .select();

        if (error) {
            console.error('Error posting message:', error);
            alert(t('postError'));
        } else if (data && data.length > 0) {
            const newId = data[0].id;

            setMessages(prev => {
                // もしSupabaseのリアルタイム通信が先に反映していた場合の重複防止
                if (prev.find(m => m.id === newId)) return prev;
                return [data[0], ...prev];
            });

            setMyMessageIds(prev => {
                const updated = [...prev, newId];
                localStorage.setItem('tama_bbs_my_posts', JSON.stringify(updated));
                return updated;
            });

            setNewName('');
            setNewContent('');
            setGuestAvatarUrl(DEFAULT_GUEST_ICON);
            setImageFile(null);
            setReplyTarget(null);
            const fileInput = document.getElementById('image-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
        setSaving(false);
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm(t('deleteConfirm'))) return;

        const { error } = await supabase
            .from(targetTable)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting message:', error);
            alert(t('deleteError'));
        } else {
            setMessages(prev => prev.filter(msg => msg.id !== id));
            setMyMessageIds(prev => {
                const updated = prev.filter(mid => mid !== id);
                localStorage.setItem('tama_bbs_my_posts', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    return (
        <div className="y2k-container" style={{ maxWidth: '800px', margin: '30px auto 0' }}>
            <h1 className="y2k-title" style={{ textAlign: 'center', lineHeight: '1.2' }}>
                {t('title')}<br />
                <span style={{ fontSize: '0.8em' }}>{t('subtitle')}</span>
            </h1>

            <div className="y2k-window" style={{ marginBottom: '20px' }}>
                <div className="y2k-window-header">{t('writeHeader')}</div>
                <div className="y2k-window-body">
                    <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {replyTarget && (
                            <div style={{ padding: '8px', backgroundColor: '#e6e6fa', border: '1px solid var(--primary-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                <span><strong>{replyTarget.name}</strong> さんへ返信中...</span>
                                <button type="button" onClick={() => setReplyTarget(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>キャンセル</button>
                            </div>
                        )}
                        {session && myProfile ? (
                            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#eee',
                                    overflow: 'hidden', border: '2px solid var(--accent-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {myProfile.avatar_url ? (
                                        <img src={myProfile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '1.2rem' }}>👤</span>
                                    )}
                                </div>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{myProfile.nickname} <span style={{fontSize: '0.8rem', color: '#666', fontWeight: 'normal'}}>として投稿</span></span>
                            </div>
                        ) : (
                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold' }}>
                                    <span>{t('nameLabel')}:</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAuthModal(true)} 
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        ※ アカウントをお持ちの方はこちら
                                    </button>
                                </label>
                                <input
                                    type="text"
                                    className="y2k-input"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder={t('namePlaceholder')}
                                    maxLength={20}
                                    required={!session}
                                />
                                
                                <div style={{ marginTop: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>アイコン設定 (任意):</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', border: '2px solid var(--accent-color)', overflow: 'hidden' }}>
                                            <img src={guestAvatarUrl || DEFAULT_GUEST_ICON} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <button type="button" onClick={() => setShowPicker(!showPicker)} className="y2k-button" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>
                                            たまごっち一覧から選ぶ
                                        </button>
                                    </div>
                                    {showPicker && (
                                        <div style={{ padding: '10px', marginTop: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {allCharacters.map(char => (
                                                <img
                                                    key={char.id} src={char.iconUrl} alt={char.name} title={char.name}
                                                    onClick={() => { setGuestAvatarUrl(char.iconUrl); setShowPicker(false); }}
                                                    style={{ width: '40px', height: '40px', cursor: 'pointer', border: '1px solid transparent', borderRadius: '8px' }}
                                                    onMouseOver={(e) => e.currentTarget.style.border = '1px solid var(--primary-color)'}
                                                    onMouseOut={(e) => e.currentTarget.style.border = '1px solid transparent'}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('contentLabel')}:</label>
                            {replyTarget && (
                                <div style={{ marginBottom: '8px', padding: '8px 12px', backgroundColor: '#f0f8ff', border: '1px dashed #add8e6', borderRadius: '4px', fontSize: '0.9rem', color: '#005f9e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span><strong>&gt; {replyTarget.name}さん</strong> への返信</span>
                                    <button type="button" onClick={() => setReplyTarget(null)} style={{ background: 'none', border: 'none', color: '#005f9e', textDecoration: 'underline', cursor: 'pointer' }}>キャンセル</button>
                                </div>
                            )}
                            <textarea
                                className="y2k-input"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder={t('contentPlaceholder')}
                                rows={5}
                                maxLength={500}
                                style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('imageUpload')}</label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*, .heic, .heif"
                                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                style={{ fontSize: '0.9rem' }}
                            />
                        </div>
                        <button type="submit" className="y2k-button" disabled={saving || (!(session && myProfile) && !newName.trim()) || (!newContent.trim() && !imageFile)}>
                            {saving ? t('loading') : t('submit')}
                        </button>
                    </form>
                </div>
            </div>

            <div className="y2k-window">
                <div className="y2k-window-header">{t('messagesHeader')}</div>
                <div className="y2k-window-body">
                    {loading && <p>{t('loading')}</p>}
                    {!loading && messages.length === 0 && <p>{t('noMessages')}</p>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((m) => (
                            <div key={m.id} style={{
                                padding: '15px',
                                border: '1px solid var(--accent-color)',
                                borderRadius: '8px',
                                backgroundColor: '#fffdf8',
                                boxShadow: '2px 2px 0px rgba(92, 64, 51, 0.1)'
                            }}>
                                <div style={{ borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '8px', fontSize: '0.9rem', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {(m.author_id && profilesMap[m.author_id]) ? (
                                            <>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#eee',
                                                    overflow: 'hidden', border: '1px solid var(--accent-color)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                }}>
                                                    {profilesMap[m.author_id].avatar_url ? (
                                                        <img src={profilesMap[m.author_id].avatar_url!} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <span style={{ fontSize: '1rem' }}>👤</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', display: 'flex', alignItems: 'center' }}>
                                                        {profilesMap[m.author_id].nickname}
                                                        <img src="/images/verified_mark.png" alt="認証済み" title="認証済みユーザー" style={{ width: '18px', height: '18px', objectFit: 'contain', marginLeft: '6px' }} />
                                                    </span>
                                                    <span style={{ marginLeft: '10px', fontSize: '0.8rem' }}>{formatDate(m.created_at)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#eee',
                                                    overflow: 'hidden', border: '1px solid #ddd',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                }}>
                                                    <img src={m.author_avatar_url || '/images/characters/01_べびまるっち.png'} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{m.author_name}</span>
                                                    <span style={{ marginLeft: '10px', fontSize: '0.8rem' }}>{formatDate(m.created_at)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <button
                                            onClick={() => {
                                                const targetName = m.author_id && profilesMap[m.author_id] ? profilesMap[m.author_id].nickname : m.author_name;
                                                setReplyTarget({ id: m.id, name: targetName });
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            返信する
                                        </button>
                                        {(myMessageIds.includes(m.id) || (session && m.author_id === session.user.id)) && (
                                            <button
                                                onClick={() => handleDelete(m.id)}
                                                style={{ background: 'none', border: 'none', color: '#ff6b6b', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                {t('delete')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                    {m.content}
                                </div>
                                {m.image_url && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img
                                            src={m.image_url}
                                            alt={t('imageAlt')}
                                            onClick={() => setLightboxUrl(m.image_url)}
                                            style={{ maxWidth: '100%', width: 'auto', maxHeight: '150px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9', display: 'block', cursor: 'pointer' }}
                                        />
                                    </div>
                                )}
                                <div className="bbs-reactions">
                                    {REACTION_EMOJIS.map(emoji => {
                                        const count = (m.reactions || {})[emoji] || 0;
                                        const reacted = (myReactions[m.id] || []).includes(emoji);
                                        return (
                                            <button
                                                key={emoji}
                                                className={`bbs-reaction-btn ${reacted ? 'reacted' : ''}`}
                                                onClick={() => handleReaction(m.id, emoji)}
                                            >
                                                <span className="bbs-reaction-emoji">{emoji}</span>
                                                {count > 0 && <span className="bbs-reaction-count">{count}</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {lightboxUrl && (
                <div
                    className="popup-overlay"
                    onClick={() => setLightboxUrl(null)}
                    style={{ cursor: 'zoom-out' }}
                >
                    <img
                        src={lightboxUrl}
                        alt={t('imageAlt')}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            cursor: 'default'
                        }}
                    />
                    <button
                        className="popup-close-btn"
                        onClick={() => setLightboxUrl(null)}
                        style={{ position: 'fixed', top: '20px', right: '20px', fontSize: '36px', color: '#fff' }}
                    >×</button>
                </div>
            )}
            
            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    );
}
