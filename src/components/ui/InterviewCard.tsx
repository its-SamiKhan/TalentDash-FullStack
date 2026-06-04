'use client';

import React from 'react';
import type { InterviewForDisplay } from '@/types';
import { CompanyLogo } from './CompanyLogo';
import { Badge } from './Badge';
import { formatDate } from '@/lib/formatters';
import Link from 'next/link';

interface InterviewCardProps {
  interview: InterviewForDisplay;
  hideCompany?: boolean;
}

export function InterviewCard({ interview, hideCompany = false }: InterviewCardProps) {
  // Map difficulty to color and text
  const getDifficultyBadge = (difficulty: number | null) => {
    if (!difficulty) return null;
    if (difficulty <= 2) {
      return <Badge variant="green">Easy ({difficulty}/5)</Badge>;
    } else if (difficulty === 3) {
      return <Badge variant="orange">Medium ({difficulty}/5)</Badge>;
    } else {
      return <Badge variant="red">Hard ({difficulty}/5)</Badge>;
    }
  };

  // Map outcome to color and text
  const getOutcomeBadge = (outcome: string | null) => {
    if (!outcome) return null;
    const cleanOutcome = outcome.toUpperCase();
    if (cleanOutcome === 'OFFER') {
      return <Badge variant="green">Offer</Badge>;
    } else if (cleanOutcome === 'REJECT') {
      return <Badge variant="red">Rejected</Badge>;
    } else {
      return <Badge variant="slate">Ghosted</Badge>;
    }
  };

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        {!hideCompany ? (
          <div className="flex items-center gap-3">
            <CompanyLogo name={interview.companyName} logoUrl={interview.companyLogoUrl} size={40} />
            <div>
              <h3 className="font-bold text-[#222222]">
                <Link
                  href={`/interviews/${interview.companySlug}`}
                  className="hover:text-[#FF5A5F] transition-colors"
                >
                  {interview.companyName}
                </Link>
              </h3>
              <p className="text-xs text-[#717171]">
                {interview.role || 'Anonymous Candidate'} • {formatDate(interview.createdAt)}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-[#222222]">{interview.role || 'Anonymous Candidate'}</h3>
            <p className="text-xs text-[#717171]">{formatDate(interview.createdAt)}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {getDifficultyBadge(interview.difficulty)}
          {getOutcomeBadge(interview.outcome)}
          {interview.rounds && (
            <Badge variant="blue">{interview.rounds} {interview.rounds === 1 ? 'Round' : 'Rounds'}</Badge>
          )}
        </div>
      </div>

      {/* Experience Story */}
      {interview.experience && (
        <div className="text-sm text-[#484848] leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-md border border-[#EBEBEB]">
          <h4 className="text-xs uppercase font-extrabold text-[#717171] tracking-wider mb-2">
            Interview Process & Experience
          </h4>
          <p className="text-[#484848]">{interview.experience}</p>
        </div>
      )}

      {/* Questions Asked */}
      {interview.questions && (
        <div className="text-sm text-[#484848] leading-relaxed whitespace-pre-line bg-[#FF5A5F]/5 p-4 rounded-md border border-[#FF5A5F]/10">
          <h4 className="text-xs uppercase font-extrabold text-[#FF5A5F] tracking-wider mb-2 flex items-center gap-1.5">
            💡 Questions Asked
          </h4>
          <p className="font-medium text-[#222222] italic">&ldquo;{interview.questions}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
