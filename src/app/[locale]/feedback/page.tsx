"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function FeedbackPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params?.locale as string || 'ja';

    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [session, setSession] = useState<any>(null);
    const [myProfile, setMyProfile] = useState<{ nickname: string, avatar_url: string | null } | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    const fetchAllData = async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // 1. Fetch Profile
        if (currentSession) {
            setSession(currentSession);
            const { data: profile } = await supabase
                .from('profiles')
                .select('nickname, avatar_url')
                .eq('id', currentSession.user.id)
                .single();
            if (profile) setMyProfile(profile);
        }

        // 2. Fetch History
        let localFeedbackIds: string[] = [];
        try {
            const local = localStorage.getItem('tama_feedbacks');
            if (local) localFeedbackIds = JSON.parse(local);
        } catch(e) {}

        let allFeedbacks: any[] = [];

        // Fetch using RPC for local storage IDs (Guest & Users)
        if (localFeedbackIds.length > 0) {
            const { data: localFeedbacks } = await supabase.rpc('get_my_feedbacks', { feedback_ids: localFeedbackIds });
            if (localFeedbacks) {
                allFeedbacks = [...localFeedbacks];
            }
        }

        // Fetch using author_id for logged in users
        if (currentSession) {
            const { data: userFeedbacks } = await supabase
                .from('feedbacks')
                .select('*')
                .eq('author_id', currentSession.user.id);
            if (userFeedbacks) {
                allFeedbacks = [...allFeedbacks, ...userFeedbacks];
            }
        }

        // Deduplicate and Sort
        const uniqueFeedbacks = Array.from(new Map(allFeedbacks.map(item => [item.id, item])).values());
        uniqueFeedbacks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setHistory(uniqueFeedbacks);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSending(true);
        setErrorMsg(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const newId = crypto.randomUUID();
            const { error } = await supabase
                .from('feedbacks')
                .insert([{
                    id: newId,
                    content: content.trim(),
                    author_id: session?.user?.id || null,
                }]);

            if (error) throw error;
            
            // 成功時にIDをlocalStorageへ記録する
            try {
                const local = localStorage.getItem('tama_feedbacks');
                const localIds = local ? JSON.parse(local) : [];
                localStorage.setItem('tama_feedbacks', JSON.stringify([...localIds, newId]));
            } catch(e) { console.error('Failed to save feedback id to local storage', e); }

            setSent(true);
            fetchAllData(); // 履歴を再取得して表示更新する
        } catch (err: any) {
            console.error(err);
            setErrorMsg('送信に失敗しました。時間をおいて再度お試しください。');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="y2k-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
            <div className="y2k-window" style={{ margin: 0 }}>
                <div className="y2k-window-header" style={{ backgroundColor: '#4b0082', color: 'white' }}>
                    📩 管理人への目安箱（ご意見・ご要望）
                </div>
                <div className="y2k-window-body" style={{ padding: '20px' }}>
                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '30px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
                            <h2 style={{ color: '#4b0082', marginBottom: '15px' }}>送信完了しました！</h2>
                            <p style={{ color: '#555', marginBottom: '20px', lineHeight: '1.6' }}>
                                メッセージを送信しました。<br />
                                貴重なご意見ありがとうございます！
                            </p>
                            <Link prefetch={false} href={`/${locale}`} className="y2k-button" style={{ display: 'inline-block', padding: '10px 20px' }}>
                                トップページへ戻る
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.6' }}>
                                サイトに関するご意見、ご要望、不具合の報告などはこちらからお送りください。<br />
                                <span style={{ color: '#c00', fontWeight: 'bold' }}>※この内容は公開されません。管理人だけが確認します。</span>
                            </p>

                            {errorMsg && (
                                <div style={{ color: 'red', fontSize: '0.9rem', padding: '10px', backgroundColor: '#ffe5e5', borderRadius: '5px' }}>
                                    {errorMsg}
                                </div>
                            )}

                            {session && myProfile && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px', padding: '12px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px dashed #add8e6' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', border: '2px solid var(--accent-color)', overflow: 'hidden', flexShrink: 0 }}>
                                        {myProfile.avatar_url ? (
                                            <img src={myProfile.avatar_url} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                            {myProfile.nickname} <span style={{fontSize: '0.8rem', color: '#666', fontWeight: 'normal'}}>として送信</span>
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#888' }}>
                                            ※送信内容は誰にも公開されません
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <textarea
                                    className="y2k-input"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="管理人へ伝えたいこと..."
                                    style={{ width: '100%', height: '200px', resize: 'vertical', padding: '12px' }}
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="y2k-button"
                                disabled={sending || !content.trim()} 
                                style={{
                                    padding: '12px',
                                    fontSize: '1rem',
                                    backgroundColor: '#4b0082',
                                    color: 'white',
                                    opacity: (sending || !content.trim()) ? 0.6 : 1,
                                    cursor: (sending || !content.trim()) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {sending ? '送信中...' : '管理人に送信する'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link prefetch={false} href={`/${locale}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                    &larr; トップページに戻る
                </Link>
            </div>

            {/* お便り履歴と返信表示エリア */}
            {history.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h2 className="y2k-title" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>送付済みのお便り</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {history.map(item => (
                            <div key={item.id} className="y2k-window" style={{ marginBottom: 0, border: item.admin_reply ? '3px solid #0288d1' : '3px solid #ccc' }}>
                                <div className="y2k-window-body" style={{ backgroundColor: item.admin_reply ? '#e1f5fe' : '#fff', padding: '15px' }}>
                                    <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#555', borderBottom: item.admin_reply ? '1px dashed #81d4fa' : '1px dashed #ccc', paddingBottom: '8px' }}>
                                        <span style={{ fontWeight: 'bold' }}>あなたが送った内容：</span><br />
                                        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'inline-block', marginTop: '4px' }}>{item.content}</span>
                                    </div>
                                    {item.admin_reply ? (
                                        <div style={{ marginTop: '10px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#0277bd', marginBottom: '5px' }}>管理人からのお返事：</div>
                                            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#01579b', fontSize: '0.95rem' }}>{item.admin_reply}</div>
                                            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#888', textAlign: 'right' }}>
                                                {new Date(item.admin_replied_at).toLocaleString('ja-JP')}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#888', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', marginTop: '10px' }}>
                                            （管理人のお返事待ちです☕️）
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
