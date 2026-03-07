import EvolutionList from '@/components/EvolutionList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'もりの進化条件リスト',
    description: 'たまごっちパラダイスの「もり」ステージに登場する全キャラクターの進化条件一覧です。',
};

export default function ForestEvolutionPage() {
    return <EvolutionList initialTab="forest" />;
}
