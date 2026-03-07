import Simulator from '@/components/Simulator';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '遺伝シミュレーター',
    description: 'たまごっちパラダイスの遺伝（交配）結果をブラウザ上でシミュレーション！ベースや目の形、色を組み合わせてプレビューできます。',
};

export default function SimulatorPage() {
    return (
        <main style={{ padding: '20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '20px' }}>
                <Link href="/" style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'underline' }}>
                    ← ホームに戻る
                </Link>
            </div>
            <Simulator />
        </main>
    );
}
