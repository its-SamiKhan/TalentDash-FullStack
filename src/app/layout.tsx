import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

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
      <body className="min-h-full flex flex-col bg-[#F7F7F7] text-[#484848] antialiased selection:bg-[#FF5A5F]/10">
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-[#EBEBEB] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#222222]">
                  Talent<span className="text-[#FF5A5F]">Dash</span>
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/salaries"
                  className="text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
                >
                  Salaries
                </Link>
                <Link
                  href="/reviews"
                  className="text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
                >
                  Reviews
                </Link>
                <Link
                  href="/interviews"
                  className="text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
                >
                  Interviews
                </Link>
                <Link
                  href="/tools"
                  className="text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
                >
                  Tools
                </Link>
                <Link
                  href="/compare"
                  className="text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
                >
                  Compare
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/compare"
                className="md:hidden text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
              >
                Compare
              </Link>
              <Link
                href="/tools"
                className="md:hidden text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
              >
                Tools
              </Link>
              <Link
                href="/interviews"
                className="md:hidden text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
              >
                Interviews
              </Link>
              <Link
                href="/reviews"
                className="md:hidden text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
              >
                Reviews
              </Link>
              <Link
                href="/salaries"
                className="md:hidden text-sm font-medium text-[#484848] hover:text-[#222222] transition-colors"
              >
                Salaries
              </Link>
              <Link
                href="/salaries?submit=true"
                className="inline-flex h-9 items-center justify-center rounded-md bg-[#FF5A5F] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ff4449] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50"
              >
                Submit Salary
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="w-full border-t border-[#EBEBEB] bg-white py-8 mt-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#222222]">
                  Talent<span className="text-[#FF5A5F]">Dash</span>
                </span>
                <span className="text-xs text-[#717171]">
                  © {new Date().getFullYear()} TalentDash. All rights reserved.
                </span>
              </div>
              <div className="flex gap-6">
                <Link href="/salaries" className="text-xs text-[#717171] hover:text-[#484848]">
                  Salary Search
                </Link>
                <Link href="/interviews" className="text-xs text-[#717171] hover:text-[#484848]">
                  Interviews
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
      </body>
    </html>
  );
}
