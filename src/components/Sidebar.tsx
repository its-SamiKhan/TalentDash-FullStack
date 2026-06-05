'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const menuItems: { label: string; href: string; icon: string; badge?: string }[] = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Companies', href: '/companies', icon: '🏢' },
    { label: 'Salaries', href: '/salaries', icon: '💵' },
    { label: 'Reviews', href: '/reviews', icon: '⭐' },
    { label: 'Interviews', href: '/interviews', icon: '📝' },
    { label: 'Jobs', href: '/jobs', icon: '💼' },
    { label: 'Community', href: '/community', icon: '👥' },
    { label: 'Tools', href: '/tools', icon: '🛠️' },
    { label: 'Offer evaluation', href: '/tools/offer-evaluation', icon: '🎁', badge: 'New' },
    { label: 'Workplace index', href: '/workplace-index', icon: '📈' },
  ];

  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-white border-r border-[#EBEBEB] justify-between select-none transition-all duration-300 relative ${
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
            // Chevron Right
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          ) : (
            // Chevron Left
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
          {/* Logo Mark resembling Airbnb / stylized TD */}
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
                  <span className="text-base leading-none shrink-0">{item.icon}</span>
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
            <span className="shrink-0 text-base leading-none">🤍</span>
            {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in duration-300">Saved</span>}
          </Link>
          <Link
            href="/compare"
            title={isCollapsed ? 'Compare' : undefined}
            className={`flex items-center gap-3 py-2 rounded-lg text-xs font-bold text-[#717171] hover:text-[#222222] hover:bg-slate-50 transition-colors ${
              isCollapsed ? 'justify-center w-full px-0' : 'px-3'
            }`}
          >
            <span className="shrink-0 text-base leading-none">⚖️</span>
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
            <span className="shrink-0 text-base leading-none">👤</span>
            {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in duration-300">Sign in</span>}
          </button>
          
          {/* Mock theme switch button */}
          {!isCollapsed && (
            <button className="text-base text-[#717171] hover:text-[#222222] transition-colors cursor-pointer animate-in fade-in duration-300">
              ☀️
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
