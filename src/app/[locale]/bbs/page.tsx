"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '../../../lib/supabaseClient';

const REACTION_EMOJIS = ['👍', '❤️', '🤣', '🤯'] as const;

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
    const [myMessageIds, setMyMessageIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
    const [myReactions, setMyReactions] = useState<Record<string, string[]>>({});

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

    // 初回マウント時にメッセージを取得＆LocalStorageから自分の投稿IDリストを復元
    useEffect(() => {
        fetchMessages();

        try {
            const saved = localStorage.getItem('tama_bbs_my_posts');
            if (saved) {
                setMyMessageIds(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to parse my posts from local storage', e);
        }

        // リアルタイム更新のサブスクリプションを設定
        const subscription = supabase
            .channel(`public:${targetTable}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: targetTable }, payload => {
                setMessages(prev => [payload.new, ...prev]);
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
        };
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from(targetTable)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            setMessages(data || []);
        }
        setLoading(false);
    };

    const handleReaction = useCallback(async (msgId: string, emoji: string) => {
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
        if (!newName.trim() || (!newContent.trim() && !imageFile)) return;

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

        const { data, error } = await supabase
            .from(targetTable)
            .insert([
                {
                    author_name: newName.trim(),
                    content: newContent.trim(),
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

            setMyMessageIds(prev => {
                const updated = [...prev, newId];
                localStorage.setItem('tama_bbs_my_posts', JSON.stringify(updated));
                return updated;
            });

            setNewName('');
            setNewContent('');
            setImageFile(null);
            const fileInput = document.getElementById('image-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('deleteConfirm'))) return;

        const { error } = await supabase
            .from(targetTable)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting message:', error);
            alert(t('deleteError'));
        } else {
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
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('nameLabel')}:</label>
                            <input
                                type="text"
                                className="y2k-input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder={t('namePlaceholder')}
                                maxLength={20}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('contentLabel')}:</label>
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
                        <button type="submit" className="y2k-button" disabled={saving || !newName.trim() || (!newContent.trim() && !imageFile)}>
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
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                padding: '15px',
                                border: '1px solid var(--accent-color)',
                                borderRadius: '8px',
                                backgroundColor: '#fffdf8',
                                boxShadow: '2px 2px 0px rgba(92, 64, 51, 0.1)'
                            }}>
                                <div style={{ borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '8px', fontSize: '0.9rem', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{msg.author_name}</span>
                                        <span style={{ marginLeft: '10px' }}>{formatDate(msg.created_at)}</span>
                                    </div>
                                    {myMessageIds.includes(msg.id) && (
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            style={{ background: 'none', border: 'none', color: '#ff6b6b', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            {t('delete')}
                                        </button>
                                    )}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                    {msg.content}
                                </div>
                                {msg.image_url && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img
                                            src={msg.image_url}
                                            alt={t('imageAlt')}
                                            onClick={() => setLightboxUrl(msg.image_url)}
                                            style={{ maxWidth: '100%', width: 'auto', maxHeight: '150px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9', display: 'block', cursor: 'pointer' }}
                                        />
                                    </div>
                                )}
                                {/* リアクションボタン */}
                                <div className="bbs-reactions">
                                    {REACTION_EMOJIS.map(emoji => {
                                        const count = (msg.reactions || {})[emoji] || 0;
                                        const reacted = (myReactions[msg.id] || []).includes(emoji);
                                        return (
                                            <button
                                                key={emoji}
                                                className={`bbs-reaction-btn ${reacted ? 'reacted' : ''}`}
                                                onClick={() => handleReaction(msg.id, emoji)}
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
        </div>
    );
}
