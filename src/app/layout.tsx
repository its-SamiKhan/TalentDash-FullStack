import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { MainLayoutWrapper } from '@/components/MainLayoutWrapper';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TalentDash — Compensation Intelligence for Tech Careers',
  description: 'Convert structured salary data into decision-ready career insights. Compare tech salaries side-by-side.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#F7F7F7] text-[#484848] antialiased selection:bg-[#FF5A5F]/10">
        <MainLayoutWrapper>
          {/* Main Content Area */}
          <main className="flex-1 w-full flex flex-col">{children}</main>

          {/* Global Footer */}
          <footer className="w-full border-t border-[#EBEBEB] bg-white py-8 mt-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center">
                  <span className="text-sm font-bold text-[#222222]">
                    Talent<span className="text-[#FF5A5F]">Dash</span>
                  </span>
                  <span className="text-xs text-[#717171]">
                    © {new Date().getFullYear()} TalentDash. All rights reserved.
                  </span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
                  <Link href="/" className="text-xs text-[#717171] hover:text-[#484848]">
                    Home
                  </Link>
                  <Link href="/salaries" className="text-xs text-[#717171] hover:text-[#484848]">
                    Salary Search
                  </Link>
                  <Link href="/interviews" className="text-xs text-[#717171] hover:text-[#484848]">
                    Interviews
                  </Link>
                  <Link href="/community" className="text-xs text-[#717171] hover:text-[#484848]">
                    Community
                  </Link>
                  <Link href="/workplace-index" className="text-xs text-[#717171] hover:text-[#484848]">
                    Workplace Index
                  </Link>
                  <Link href="/tools" className="text-xs text-[#717171] hover:text-[#484848]">
                    Career Tools
                  </Link>
                  <Link href="/compare" className="text-xs text-[#717171] hover:text-[#484848]">
                    Comparison Tool
                  </Link>
                  <a
                    href="#top"
                    className="text-xs text-[#717171] hover:text-[#484848]"
                  >
                    Back to Top ↑
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </MainLayoutWrapper>
      </body>
    </html>
  );
}
