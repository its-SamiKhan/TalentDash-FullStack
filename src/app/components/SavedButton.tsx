'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// SavedButton reads saved items from localStorage and displays a button with total count.
// Clicking the button navigates to the /saved page.

export default function SavedButton() {
  const [savedCount, setSavedCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem('saved-jobs') || '[]');
    const salaries = JSON.parse(localStorage.getItem('saved-salaries') || '[]');
    const companies = JSON.parse(localStorage.getItem('saved-companies') || '[]');
    const total = (jobs?.length || 0) + (salaries?.length || 0) + (companies?.length || 0);
    setSavedCount(total);
  }, []);

  const handleClick = () => {
    router.push('/saved');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EBEBEB] rounded-lg shadow-sm hover:border-[#FF5A5F]/30 transition-colors text-sm font-medium text-[#222222]"
    >
      <span className="text-base">💾</span>
      <span>Saved</span>
      {savedCount > 0 && (
        <span className="ml-1 text-xs font-bold bg-[#FF5A5F]/10 text-[#FF5A5F] px-1.5 py-0.5 rounded-full">{savedCount}</span>
      )}
    </button>
  );
}
