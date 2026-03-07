import EvolutionList from '@/components/EvolutionList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'りくの進化条件リスト',
    description: 'たまごっちパラダイスの「りく」ステージに登場する全キャラクターの進化条件一覧です。',
};

export default function LandEvolutionPage() {
    return <EvolutionList initialTab="land" />;
}
