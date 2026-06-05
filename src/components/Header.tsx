'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/companies', label: 'Companies' },
    { href: '/salaries', label: 'Salaries' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/interviews', label: 'Interviews' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/community', label: 'Community' },
    { href: '/workplace-index', label: 'Workplace Index' },
    { href: '/tools', label: 'Tools' },
    { href: '/compare', label: 'Compare' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EBEBEB] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Column: Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold tracking-tight text-[#222222]">
              Talent<span className="text-[#FF5A5F]">Dash</span>
            </span>
          </Link>
        </div>
        
        {/* Center Column: Desktop Nav - centered in the header */}
        <nav className="hidden lg:flex items-center justify-center gap-5">
          {navLinks.map((link) => {
            // Highlight active link in red, but exclude the Home link ('/') from default active highlighting
            const isActive = pathname === link.href && link.href !== '/';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#FF5A5F] ${
                  isActive ? 'text-[#FF5A5F]' : 'text-[#484848]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Column: Actions */}
        <div className="flex-1 flex justify-end items-center gap-3">
          {/* Submit Salary Button - Always visible, but smaller on very small screens to avoid overflow */}
          <Link
            href="/salaries?submit=true"
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#FF5A5F] px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#ff4449] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50"
          >
            Submit Salary
          </Link>

          {/* Hamburger Menu Toggle Button - Visible only under lg breakpoint */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#484848] hover:bg-slate-100 hover:text-[#222222] focus:outline-none lg:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              // Close Icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Menu Icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Drawer - visible under lg breakpoint when open */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-[#EBEBEB] bg-white animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href && link.href !== '/';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`flex items-center h-10 px-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FF5A5F]/10 text-[#FF5A5F]'
                      : 'text-[#484848] hover:bg-slate-50 hover:text-[#FF5A5F]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
