"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function BBS() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newName, setNewName] = useState('');
    const [newContent, setNewContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [myMessageIds, setMyMessageIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

        // リアルタイム更新のサブスクリプションを設定（オプション）
        const subscription = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                setMessages(prev => [payload.new, ...prev]);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, payload => {
                setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            setMessages(data || []);
        }
        setLoading(false);
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || (!newContent.trim() && !imageFile)) return;

        setSaving(true);
        let imageUrl = null;

        // 画像のアップロード処理
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('bbs-images')
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                alert('画像のアップロードに失敗しました。');
                setSaving(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('bbs-images')
                .getPublicUrl(filePath);

            imageUrl = publicUrlData.publicUrl;
        }

        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    author_name: newName.trim(),
                    content: newContent.trim(),
                    image_url: imageUrl,
                    delete_password: null // 使わない
                }
            ])
            .select(); // 挿入したデータを返すように指定

        if (error) {
            console.error('Error posting message:', error);
            alert('投稿に失敗しました。');
        } else if (data && data.length > 0) {
            const newId = data[0].id;

            // LocalStorageに自分の投稿であることを記録する
            setMyMessageIds(prev => {
                const updated = [...prev, newId];
                localStorage.setItem('tama_bbs_my_posts', JSON.stringify(updated));
                return updated;
            });

            setNewName('');
            setNewContent('');
            setImageFile(null);
            // reset file input
            const fileInput = document.getElementById('image-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('本当にこの書き込みを削除しますか？')) return;

        // LocalStorage 방식이므로 본인 확인은 클라이언트 UI에서 이루어짐.
        // 하지만 DB 보안(RLS)상으로는 누구나 삭제 가능하므로 실제 앱에서는 조심해야 함.
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting message:', error);
            alert('削除エラーが発生しました。');
        } else {
            // ローカルリストからも消しておく
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
        <div className="y2k-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="y2k-title" style={{ textAlign: 'center', lineHeight: '1.2' }}>
                たまコーヒーハウス<br />
                <span style={{ fontSize: '0.8em' }}>みんなの掲示板</span>
            </h1>

            <div className="y2k-window" style={{ marginBottom: '20px' }}>
                <div className="y2k-window-header">メッセージを書き込む</div>
                <div className="y2k-window-body">
                    <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>なまえ:</label>
                            <input
                                type="text"
                                className="y2k-input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="名無しっち"
                                maxLength={20}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>めっせーじ:</label>
                            <textarea
                                className="y2k-input"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="たまごっちの交配結果などを共有しよう！"
                                rows={5}
                                maxLength={500}
                                style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>がぞう (任意):</label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                style={{ fontSize: '0.9rem' }}
                            />
                        </div>
                        <button type="submit" className="y2k-button" disabled={saving || !newName.trim() || (!newContent.trim() && !imageFile)}>
                            {saving ? 'かきこみ中...' : 'かきこむ！'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="y2k-window">
                <div className="y2k-window-header">みんなの書き込み</div>
                <div className="y2k-window-body">
                    {loading && <p>読み込み中...</p>}
                    {!loading && messages.length === 0 && <p>まだ書き込みがありません。最初のメッセージを投稿しよう！</p>}

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
                                            削除
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
                                            alt="投稿画像"
                                            style={{ maxWidth: '100%', width: 'auto', maxHeight: '150px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9', display: 'block' }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
