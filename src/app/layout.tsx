import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | たまコーヒーハウス",
    default: "たまコーヒーハウス | たまごっちパラダイス攻略＆交流サイト",
  },
  description: "たまごっちパラダイスの攻略・遺伝シミュレーター・交流サイト。可愛く簡単なUIでサポート！",
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

