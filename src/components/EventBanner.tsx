"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTodayEvents } from '../utils/eventUtils';
import { TamaEvent } from '../data/eventData';

export default function EventBanner() {
    const [events, setEvents] = useState<TamaEvent[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // コンポーネントのマウント時（クライアント側）でのみ日付判定を実行する
        // これによりSSRでのハイドレーションエラー（サーバー時間とクライアント時間のズレ）を防ぐ
        const todayEvents = getTodayEvents(new Date());
        setEvents(todayEvents);
        setMounted(true);
    }, []);

    // SSR時やイベントがない場合は何も表示しない
    if (!mounted || events.length === 0) return null;

    return (
        <div style={{
            backgroundColor: '#fff8e1',
            border: '3px solid #ffb300',
            borderRadius: '12px',
            padding: '15px 20px',
            margin: '20px auto 30px auto',
            maxWidth: '600px',
            boxShadow: '0 4px 6px rgba(255, 179, 0, 0.2)',
            textAlign: 'center'
        }}>
            <h3 style={{ color: '#e65100', marginBottom: '10px', fontSize: '1.2rem' }}>
                🎉 本日開催中のイベント！
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                {events.map(ev => (
                    <li key={ev.id} style={{ marginBottom: '8px', color: 'var(--text-color)', fontWeight: 'bold' }}>
                        {!ev.id.startsWith('mo') && (
                            <span style={{ color: '#d84315', marginRight: '5px' }}>{ev.time}:</span>
                        )}
                        {ev.description}
                    </li>
                ))}
            </ul>
            <Link href="/events" className="y2k-button" style={{ 
                fontSize: '0.9rem', 
                padding: '6px 15px', 
                backgroundColor: '#fff', 
                borderColor: '#ffb300',
                color: '#e65100'
            }}>
                すべてのイベントを見る
            </Link>
        </div>
    );
}
