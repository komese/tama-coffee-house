import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | たまコーヒーハウス",
    default: "たまコーヒーハウス | たまごっちパラダイス攻略＆交流サイト",
  },
  description: "たまごっちパラダイスの攻略＆交流サイト「たまコーヒーハウス」へようこそ！ブリードで遺伝するキャラクターの見た目のシミュレーターや、全ステージ（りく・みず・そら・もり）全キャラの進化じょうけんの一覧を確認できます！たまパラファン同士で語り合える掲示板も完備！！",
  verification: {
    google: "hTdchN2Aw7YXXoFueBlZ073A_Yej0lgcBIyVdzBrJEA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

