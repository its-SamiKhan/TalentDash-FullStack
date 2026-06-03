'use client';

import React from 'react';
import type { SortOption } from '@/types';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  currentSort: SortOption;
  onSort: (sort: SortOption) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  currentSort,
  onSort,
}: DataTableProps<T>) {
  const handleSortClick = (key: string) => {
    if (key === 'totalCompensation') {
      if (currentSort === 'total_comp_desc') {
        onSort('total_comp_asc');
      } else {
        onSort('total_comp_desc');
      }
    }
  };

  const getSortIcon = (key: string) => {
    if (key !== 'totalCompensation') return null;
    if (currentSort === 'total_comp_desc') return ' ↓';
    if (currentSort === 'total_comp_asc') return ' ↑';
    return ' ↕';
  };

  return (
    <div className="w-full overflow-x-auto border border-[#EBEBEB] rounded-lg bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm text-[#484848]">
        <thead className="bg-slate-50 border-b border-[#EBEBEB] text-xs font-bold uppercase tracking-wider text-[#717171] sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-6 py-4 font-semibold ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                } ${col.sortable ? 'cursor-pointer select-none hover:text-[#222222] transition-colors' : ''}`}
                onClick={() => col.sortable && handleSortClick(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && <span className="text-[10px] text-[#717171] font-normal">{getSortIcon(col.key)}</span>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EBEBEB]">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-[#F2F2F2]/60 transition-colors">
              {columns.map((col) => {
                const content = col.render ? col.render(item) : ((item as Record<string, unknown>)[col.key] as React.ReactNode);
                return (
                  <td
                    key={col.key}
                    className={`px-6 py-4 whitespace-nowrap align-middle ${
                      col.align === 'right' ? 'text-right font-semibold text-[#222222]' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
