import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://tama-coffee-house.vercel.app'; 

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
            {
                // 主要なアクセス過多なボットやスクレイパーを一斉にブロック
                userAgent: [
                    'Bytespider', 'Amazonbot', 'ClaudeBot', 'GPTBot',
                    'PetalBot', 'SemrushBot', 'AhrefsBot', 'MJ12bot',
                    'DotBot', 'Baiduspider', 'YandexBot', 'Barkrowler',
                    'BLEXBot', 'MegaIndex.ru', 'bingbot', 'TurnitinBot',
                    'DataForSeoBot', 'SeekportBot', 'CensysInspect', 'AwarioRssBot',
                    'YisouSpider', 'Sogou web spider', '360Spider'
                ],
                disallow: '/',
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
