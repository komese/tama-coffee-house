// Root layout - delegates to [locale]/layout.tsx
// This is required by Next.js even when using next-intl
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
