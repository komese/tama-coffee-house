import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tama-coffee-house.vercel.app';
    const locales = ['ja', 'en', 'zh-TW', 'ko'] as const;
    const defaultLocale = 'ja';

    const pages: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
        { path: '/', changeFrequency: 'weekly', priority: 1 },
        { path: '/simulator', changeFrequency: 'weekly', priority: 0.9 },
        { path: '/family-tree', changeFrequency: 'weekly', priority: 0.9 },
        { path: '/evolution/land', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/evolution/sea', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/evolution/sky', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/evolution/forest', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/bbs', changeFrequency: 'daily', priority: 0.7 },
    ];

    const entries: MetadataRoute.Sitemap = [];

    for (const page of pages) {
        for (const locale of locales) {
            const prefix = locale === defaultLocale ? '' : `/${locale}`;
            entries.push({
                url: `${baseUrl}${prefix}${page.path === '/' ? '' : page.path}`,
                lastModified: new Date(),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
            });
        }
    }

    return entries;
}
