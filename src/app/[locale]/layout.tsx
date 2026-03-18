import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: {
      template: `%s | ${locale === 'ja' ? 'たまコーヒーハウス' : 'Tama Coffee House'}`,
      default: t('siteTitle'),
    },
    description: t('siteDescription'),
    metadataBase: new URL('https://tama-coffee-house.vercel.app'),
    openGraph: {
      type: 'website',
      siteName: locale === 'ja' ? 'たまコーヒーハウス' : 'Tama Coffee House',
      title: t('siteTitle'),
      description: t('siteDescription'),
      images: ['/icon.png'],
    },
    twitter: {
      card: 'summary',
      title: locale === 'ja' ? 'たまコーヒーハウス' : 'Tama Coffee House',
      description: t('siteDescription'),
      images: ['/icon.png'],
    },
    verification: {
      google: "hTdchN2Aw7YXXoFueBlZ073A_Yej0lgcBIyVdzBrJEA",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
