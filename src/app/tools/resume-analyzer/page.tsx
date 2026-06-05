'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface CategoryScore {
  name: string;
  score: number;
  color: string;
}

interface BulletPointFeedback {
  type: 'success' | 'warning' | 'error';
  text: string;
}

interface ResumeReport {
  score: number;
  categories: CategoryScore[];
  bulletPoints: BulletPointFeedback[];
}

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ResumeReport | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    setReport(null);

    // Simulate AI scan delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setReport({
        score: 78,
        categories: [
          { name: 'Formatting & Layout', score: 85, color: '#008A05' },
          { name: 'Action Verbs & Impact', score: 70, color: '#FFB400' },
          { name: 'ATS & Keyword Optimization', score: 74, color: '#FFB400' },
          { name: 'Quantifiable Results', score: 62, color: '#D93025' },
        ],
        bulletPoints: [
          {
            type: 'success',
            text: 'Excellent use of clean section headers and reverse-chronological order.',
          },
          {
            type: 'warning',
            text: 'Replace passive phrases like "Responsible for developing" with strong action verbs (e.g. "Architected", "Engineered").',
          },
          {
            type: 'error',
            text: 'Missing quantifiable metrics. Try to state exact impact (e.g., "reduced latency by 35%" instead of "improved latency").',
          },
          {
            type: 'success',
            text: 'Good presence of modern frontend keywords like React, TypeScript, and Tailwind CSS.',
          },
          {
            type: 'warning',
            text: 'Consider adding keywords related to performance and scaling: "RSC", "SSR", "CDN caching", "connection pooling".',
          },
        ],
      });
    }, 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/tools"
          className="text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors"
        >
          ← Back to Tools
        </Link>
      </div>

      {/* Header */}
      <div className="pb-6 border-b border-[#EBEBEB]">
        <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
          AI Resume Analyzer & Feedback
        </h1>
        <p className="text-sm text-[#717171] mt-1.5 font-medium">
          Paste your resume text below to scan it for ATS keyword compatibility, verb strength, and quantifiable engineering metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-1 bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="text-base font-bold text-[#222222] border-b border-[#EBEBEB] pb-3">
            Resume Source Text
          </h2>

          <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#717171]">
                Paste Resume Content
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume work experience, skills, and projects here..."
                className="w-full h-80 rounded-md border border-[#EBEBEB] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 resize-none"
                required
                disabled={isAnalyzing}
              />
            </div>

            <Button
              type="submit"
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full bg-[#FF5A5F] hover:bg-[#ff4449]"
            >
              {isAnalyzing ? 'Analyzing Resume...' : 'Analyze Resume'}
            </Button>
          </form>
        </div>

        {/* Results/Report Column */}
        <div className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col justify-center min-h-[400px]">
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="h-10 w-10 border-4 border-[#FF5A5F]/20 border-t-[#FF5A5F] rounded-full animate-spin" />
              <p className="text-sm text-[#717171] font-semibold animate-pulse">
                Scanning resume structure, calculating ATS scores, and evaluating verb impact...
              </p>
            </div>
          )}

          {!isAnalyzing && !report && (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
              <div className="h-12 w-12 text-[#717171] flex items-center justify-center bg-slate-50 border border-[#EBEBEB] rounded-full">
                🔍
              </div>
              <h3 className="text-base font-bold text-[#222222]">No Analysis Yet</h3>
              <p className="text-sm text-[#717171] max-w-xs">
                Paste your resume details in the form on the left to generate an AI feedback report.
              </p>
            </div>
          )}

          {!isAnalyzing && report && (
            <div className="flex flex-col gap-6">
              {/* Score Header */}
              <div className="flex items-center gap-5 border-b border-[#EBEBEB] pb-5">
                <div className="h-20 w-20 rounded-full border-4 border-[#008A05] flex flex-col items-center justify-center bg-slate-50 shadow-inner">
                  <span className="text-2xl font-black text-[#222222]">{report.score}</span>
                  <span className="text-[10px] text-[#717171] font-bold uppercase tracking-wider">Score</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#222222]">AI Evaluation Complete</h3>
                  <p className="text-sm text-[#717171] mt-0.5">
                    Your resume has solid formatting, but could benefit from stronger impact metrics.
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.categories.map((cat: CategoryScore) => (
                  <div key={cat.name} className="border border-[#EBEBEB] rounded-lg p-4 bg-slate-50 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#484848]">{cat.name}</span>
                      <span className="text-xs font-bold text-[#222222]">{cat.score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.score}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="flex flex-col gap-3 mt-2">
                <h4 className="text-sm font-bold text-[#222222]">Detailed Bullet Point Recommendations</h4>
                <div className="flex flex-col gap-2">
                  {report.bulletPoints.map((pt: BulletPointFeedback, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-start text-sm bg-white border border-[#EBEBEB] p-3.5 rounded-lg shadow-sm">
                      <span className="text-lg leading-none">
                        {pt.type === 'success' && '✅'}
                        {pt.type === 'warning' && '⚠️'}
                        {pt.type === 'error' && '❌'}
                      </span>
                      <p className="text-[#484848] leading-relaxed">{pt.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
