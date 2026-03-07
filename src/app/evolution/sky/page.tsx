import EvolutionList from '@/components/EvolutionList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'そらの進化条件リスト',
    description: 'たまごっちパラダイスの「そら」ステージに登場する全キャラクターの進化条件一覧です。',
};

export default function SkyEvolutionPage() {
    return <EvolutionList initialTab="sky" />;
}
