import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search terms or filter settings to find what you are looking for.',
  onReset,
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-white border border-[#EBEBEB] rounded-lg">
      <div className="h-12 w-12 text-[#717171] flex items-center justify-center bg-slate-50 border border-[#EBEBEB] rounded-full">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-bold text-[#222222]">{title}</h3>
      <p className="mt-2 text-sm text-[#717171] max-w-sm">{description}</p>
      {onReset && (
        <div className="mt-6">
          <Button variant="secondary" onClick={onReset}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
