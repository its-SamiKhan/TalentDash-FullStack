'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

/* Simple SVG icon components — thin stroke, clean minimal style */
const Icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  building: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2" />
      <path d="M9 21v-3h6v3" />
    </svg>
  ),
  salary: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  interview: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="12" y2="13" />
    </svg>
  ),
  briefcase: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="2" y1="13" x2="22" y2="13" />
    </svg>
  ),
  community: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  tools: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  gift: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8" />
      <path d="M16.5 8a2.5 2.5 0 000-5C15 3 12 8 12 8" />
    </svg>
  ),
  trendingUp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  heart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  compare: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
};

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const menuItems: { label: string; href: string; icon: React.ReactNode; badge?: string }[] = [
    { label: 'Home', href: '/', icon: Icons.home },
    { label: 'Companies', href: '/companies', icon: Icons.building },
    { label: 'Salaries', href: '/salaries', icon: Icons.salary },
    { label: 'Reviews', href: '/reviews', icon: Icons.star },
    { label: 'Interviews', href: '/interviews', icon: Icons.interview },
    { label: 'Jobs', href: '/jobs', icon: Icons.briefcase },
    { label: 'Community', href: '/community', icon: Icons.community },
    { label: 'Tools', href: '/tools', icon: Icons.tools },
    { label: 'Offer evaluation', href: '/tools/offer-evaluation', icon: Icons.gift },
    { label: 'Workplace index', href: '/workplace-index', icon: Icons.trendingUp },
  ];

  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-white border-r border-[#EBEBEB] justify-between select-none transition-all duration-300 ${
        isCollapsed ? 'lg:w-16 p-4 items-center' : 'lg:w-64 p-6'
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-7 h-6 w-6 rounded-full border border-[#EBEBEB] bg-white items-center justify-center cursor-pointer shadow-3xs z-50 hover:border-[#FF5A5F] hover:bg-slate-50 hover:text-[#FF5A5F] text-[#717171] transition-all focus:outline-none"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          )}
        </button>
      )}

      <div className="flex flex-col gap-8 w-full">
        {/* Logo */}
        <Link
          href="/"
          className={`flex items-center gap-2.5 ${isCollapsed ? 'px-0 justify-center' : 'px-2'}`}
        >
          {/* Logo Mark */}
          <div className="h-8 w-8 bg-[#FF5A5F] rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm shadow-[#FF5A5F]/20 shrink-0">
            T
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-[#222222] tracking-tight whitespace-nowrap animate-in fade-in duration-300">
              Talent<span className="text-[#FF5A5F]">Dash</span>
            </span>
          )}
        </Link>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 w-full">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#FF5A5F]/10 text-[#FF5A5F]'
                    : 'text-[#484848] hover:bg-slate-50 hover:text-[#222222]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="whitespace-nowrap animate-in fade-in duration-300">{item.label}</span>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#717171] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6 w-full mt-auto">
        {/* Secondary items */}
        <div className={`flex flex-col gap-1 border-t border-[#EBEBEB] pt-4 w-full ${isCollapsed ? 'items-center' : ''}`}>
          <Link
            href="/saved"
            title={isCollapsed ? 'Saved' : undefined}
            className={`flex items-center gap-3 py-2 rounded-lg text-xs font-bold text-[#717171] hover:text-[#222222] hover:bg-slate-50 transition-colors ${
              isCollapsed ? 'justify-center w-full px-0' : 'px-3'
            }`}
          >
            <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">{Icons.heart}</span>
            {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in duration-300">Saved</span>}
          </Link>
          <Link
            href="/compare"
            title={isCollapsed ? 'Compare' : undefined}
            className={`flex items-center gap-3 py-2 rounded-lg text-xs font-bold text-[#717171] hover:text-[#222222] hover:bg-slate-50 transition-colors ${
              isCollapsed ? 'justify-center w-full px-0' : 'px-3'
            }`}
          >
            <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">{Icons.compare}</span>
            {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in duration-300">Compare</span>}
          </Link>
        </div>

        {/* Go Pro promo card */}
        {!isCollapsed && (
          <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-xl p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-extrabold text-[#222222]">Go Pro</h4>
              <p className="text-[10px] text-[#717171] leading-relaxed">
                Unlock full access to salaries, reviews & insights.
              </p>
            </div>
            <button className="w-full bg-[#FF5A5F] hover:bg-[#ff4449] text-white font-bold text-[10px] py-2 px-3 rounded-lg shadow-sm transition-colors cursor-pointer select-none">
              View Plans
            </button>
          </div>
        )}

        {/* User Auth Footer */}
        <div className={`flex items-center border-t border-[#EBEBEB] pt-4 w-full ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'}`}>
          <button
            title={isCollapsed ? 'Sign in' : undefined}
            className="flex items-center gap-2 text-xs font-bold text-[#484848] hover:text-[#FF5A5F] transition-colors cursor-pointer"
          >
            <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">{Icons.user}</span>
            {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in duration-300">Sign in</span>}
          </button>
          
          {/* Mock theme switch button */}
          {!isCollapsed && (
            <button className="text-[#717171] hover:text-[#222222] transition-colors cursor-pointer animate-in fade-in duration-300 flex items-center justify-center w-[18px] h-[18px]">
              {Icons.sun}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
