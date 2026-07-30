import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaufikDevAnalytics — Enterprise Dashboard',
  description: 'Analytics Dashboard modern berbasis Next.js, Tailwind CSS, Recharts, dan TanStack Table.',
  icons: {
    icon: '/taufik_dev_logo.jpg',
    shortcut: '/taufik_dev_logo.jpg',
    apple: '/taufik_dev_logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
