"use client";

import { useState } from 'react';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSending(true);
        setErrorMsg(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const { error } = await supabase
                .from('feedbacks')
                .insert([{
                    content: content.trim(),
                    author_id: session?.user?.id || null,
                }]);

            if (error) throw error;
            setSent(true);
        } catch (err: any) {
            console.error(err);
            setErrorMsg('送信に失敗しました。時間をおいて再度お試しください。');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="y2k-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
            <div className="y2k-window">
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
                    &larr; 戻る
                </Link>
            </div>
        </div>
    );
}
