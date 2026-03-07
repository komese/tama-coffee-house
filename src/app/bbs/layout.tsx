import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'みんなの掲示板',
    description: 'たまごっちパラダイスの情報交換や遺伝シミュレーターの結果をシェアできる、みんなの交流用掲示板です！',
};

export default function BBSLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
