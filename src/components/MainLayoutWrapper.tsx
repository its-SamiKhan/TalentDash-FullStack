'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

interface MainLayoutWrapperProps {
  children: React.ReactNode;
}

export function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      const timer = setTimeout(() => {
        setIsCollapsed(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleToggle = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Sidebar navigation - Desktop */}
      <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />

      {/* Right layout box containing top navigation (mobile) and main content wrapper */}
      <div
        className={`flex-1 flex flex-col w-full min-w-0 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        {/* Header (Top Nav) - Mobile Only */}
        <div className="lg:hidden">
          <Header />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">{children}</main>
      </div>
    </div>
  );
}
