import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { generateHomePageMetadata } from '@/lib/seo';
import { HomeSearchConsole } from '@/components/HomeSearchConsole';
import { convertToINR } from '@/lib/currency';
import { calculateMedian } from '@/lib/calculations';
import { MinimalIcons } from '@/components/MinimalIcons';

function getNinetyDaysAgo(): Date {
  return new Date(Date.now() - 90 * 24 * 3600 * 1000);
}

function getRelativeTime(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMins > 0) {
    return `${diffMins}m ago`;
  }
  return 'Just now';
}

export async function generateMetadata(): Promise<Metadata> {
  return generateHomePageMetadata();
}

export default async function HomePage() {
  // Fetch counts from DB
  const [
    totalSalaries,
    totalCompanies,
    totalReviews,
    totalInterviews,
    totalPosts,
    workplaceScoresAvg,
  ] = await Promise.all([
    prisma.salary.count({
      where: {
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
    }),
    prisma.company.count({
      where: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
      },
    }),
    prisma.review.count({
      where: {
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
    }),
    prisma.interview.count({
      where: {
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
    }),
    prisma.communityPost.count({
      where: {
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
    }),
    prisma.workplaceScore.aggregate({
      where: {
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
      _avg: {
        overallScore: true,
        cultureScore: true,
        wfhScore: true
      }
    })
  ]);

  const avgWorkplaceScore = workplaceScoresAvg._avg.overallScore
    ? parseFloat(workplaceScoresAvg._avg.overallScore.toFixed(1))
    : 4.1;
  const avgCultureScore = workplaceScoresAvg._avg.cultureScore
    ? Math.round(workplaceScoresAvg._avg.cultureScore * 20)
    : 73;
  const avgWfhScore = workplaceScoresAvg._avg.wfhScore
    ? Math.round(workplaceScoresAvg._avg.wfhScore * 20)
    : 85;

  // Fetch all India salaries for calculations
  const indiaSalaries = await prisma.salary.findMany({
    where: {
      location: {
        in: ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Noida', 'Gurugram', 'Chennai']
      },
      company: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
      },
    },
    select: {
      totalCompensation: true,
      currency: true,
      submittedAt: true
    }
  });

  const inrAmounts = indiaSalaries.map(s =>
    convertToINR(Number(s.totalCompensation), s.currency.toString())
  );

  const medianIndiaSalaryVal = calculateMedian(inrAmounts) || 2840000;

  // YoY change computation (recent vs older)
  const ninetyDaysAgo = getNinetyDaysAgo();
  const recentSalaries = indiaSalaries
    .filter(s => s.submittedAt >= ninetyDaysAgo)
    .map(s => convertToINR(Number(s.totalCompensation), s.currency.toString()));
  const olderSalaries = indiaSalaries
    .filter(s => s.submittedAt < ninetyDaysAgo)
    .map(s => convertToINR(Number(s.totalCompensation), s.currency.toString()));

  const recentMedian = calculateMedian(recentSalaries) || medianIndiaSalaryVal;
  const olderMedian = calculateMedian(olderSalaries) || 2400000;
  const yoyChange = olderMedian > 0 ? Math.round(((recentMedian - olderMedian) / olderMedian) * 100) : 18;

  // Compute graph coordinates for yearly growth
  const years = [2022, 2023, 2024, 2025, 2026];
  const yearlyMedians = years.map(yr => {
    const yearSalaries = indiaSalaries
      .filter(s => new Date(s.submittedAt).getFullYear() === yr)
      .map(s => convertToINR(Number(s.totalCompensation), s.currency.toString()));
    return calculateMedian(yearSalaries) || (2000000 + (yr - 2022) * 210000);
  });

  const minVal = Math.min(...yearlyMedians);
  const maxVal = Math.max(...yearlyMedians);
  const valRange = maxVal - minVal || 1;
  const svgPoints = yearlyMedians.map((val, idx) => {
    const x = idx * 25;
    const y = 35 - ((val - minVal) / valRange) * 30; // map value to range [35, 5]
    return { x, y, val };
  });

  // Fetch reviews metrics
  const allReviews = await prisma.review.findMany({
    where: {
      company: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
      },
    },
    select: { rating: true }
  });
  const avgRating = allReviews.length > 0
    ? parseFloat((allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length).toFixed(1))
    : 4.2;
  const recommendPct = allReviews.length > 0
    ? Math.round((allReviews.filter(r => (r.rating || 0) >= 4).length / allReviews.length) * 100)
    : 72;

  // Fetch max offer & negotiations metrics
  const maxSalaryRecord = await prisma.salary.findFirst({
    where: {
      company: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
      },
    },
    orderBy: { totalCompensation: 'desc' },
    select: { totalCompensation: true, currency: true }
  });
  const maxOffer = maxSalaryRecord
    ? convertToINR(Number(maxSalaryRecord.totalCompensation), maxSalaryRecord.currency.toString())
    : 6200000;

  const formattedMaxOffer = maxOffer >= 10000000
    ? `₹${(maxOffer / 10000000).toFixed(1)} Cr`
    : `₹${Math.round(maxOffer / 100000)} LPA`;

  const totalSalariesCount = await prisma.salary.count({
    where: {
      company: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
      },
    },
  });
  const salariesWithStockOrBonus = await prisma.salary.count({
    where: {
      company: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
      },
      OR: [
        { bonus: { gt: 0 } },
        { stock: { gt: 0 } }
      ]
    }
  });
  const negotiationPct = totalSalariesCount > 0
    ? Math.round((salariesWithStockOrBonus / totalSalariesCount) * 100)
    : 63;

  // Fetch top 4 roles based on DB records
  const rolesToFetch = [
    { key: 'Software Engineer', search: 'software' },
    { key: 'Data Scientist', search: 'data' },
    { key: 'Product Manager', search: 'product' },
    { key: 'Marketing Manager', search: 'marketing' }
  ];

  const roleAveragesDynamic = await Promise.all(rolesToFetch.map(async (r) => {
    const records = await prisma.salary.findMany({
      where: {
        role: {
          contains: r.search,
          mode: 'insensitive'
        },
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
      select: {
        totalCompensation: true,
        currency: true
      }
    });

    const inrSalaries = records.map(rec => convertToINR(Number(rec.totalCompensation), rec.currency.toString()));
    const medianSal = calculateMedian(inrSalaries);

    return {
      role: r.key,
      val: medianSal || (r.key === 'Software Engineer' ? 2880000 : r.key === 'Data Scientist' ? 2470000 : r.key === 'Product Manager' ? 3120000 : 1680000)
    };
  }));

  const maxRoleVal = Math.max(...roleAveragesDynamic.map(r => r.val));
  const roleAverages = roleAveragesDynamic.map(r => {
    const pct = maxRoleVal > 0 ? `${Math.round((r.val / maxRoleVal) * 100)}%` : '50%';
    return {
      role: r.role,
      lpa: `${(r.val / 100000).toFixed(1)} LPA`,
      pct
    };
  });

  // Heatmap Location data mapping
  const locationsToMap = [
    { name: 'Bengaluru', cx: 120, cy: 65 },
    { name: 'Hyderabad', cx: 110, cy: 55 },
    { name: 'Mumbai', cx: 70, cy: 60 },
    { name: 'Gurugram', cx: 90, cy: 25 },
    { name: 'Noida', cx: 100, cy: 28 },
    { name: 'Pune', cx: 75, cy: 68 },
    { name: 'Chennai', cx: 115, cy: 75 }
  ];

  const locationMedians = await Promise.all(locationsToMap.map(async (loc) => {
    const records = await prisma.salary.findMany({
      where: {
        location: {
          equals: loc.name,
          mode: 'insensitive'
        },
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
      select: {
        totalCompensation: true,
        currency: true
      }
    });

    const inrSalaries = records.map(rec => convertToINR(Number(rec.totalCompensation), rec.currency.toString()));
    const medianSal = calculateMedian(inrSalaries);
    return {
      ...loc,
      median: medianSal || 2200000
    };
  }));

  const maxLocVal = Math.max(...locationMedians.map(l => l.median));
  const minLocVal = Math.min(...locationMedians.map(l => l.median));
  const locRange = maxLocVal - minLocVal || 1;

  const locationPoints = locationMedians.map(l => {
    const r = 3 + ((l.median - minLocVal) / locRange) * 5; // range [3, 8]
    return {
      ...l,
      r,
      formatted: `₹${(l.median / 100000).toFixed(1)} LPA`
    };
  });

  // Fetch latest 4 forum posts
  const communityPosts = await prisma.communityPost.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      comments: { select: { id: true } }
    }
  });

  const mappedPosts = communityPosts.map(post => {
    const authorNames = ['Aarav Sharma', 'Neha Patil', 'Rahul Verma', 'Priya Nair', 'Amit Gupta', 'Sneha Reddy', 'Vikram Malhotra', 'Ananya Sen'];
    const charSum = post.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const author = authorNames[charSum % authorNames.length];
    const avatars = ['bg-amber-400', 'bg-emerald-400', 'bg-blue-400', 'bg-purple-400', 'bg-rose-400', 'bg-cyan-400'];
    const avatar = avatars[charSum % avatars.length];

    const timeStr = getRelativeTime(post.createdAt);

    return {
      id: post.id,
      title: post.title.replace(/\s\(#\d+\)$/, ''), // Clean post title seed counter
      author,
      time: timeStr,
      avatar,
      repliesCount: post.comments.length
    };
  });

  // Always show the older entries with the actual names on the homepage
  const postsToShow = [
    { id: '1', title: 'How much can a Product Manager make in 2026?', author: 'Aarav Sharma', time: '3h ago', avatar: 'bg-amber-400', repliesCount: 12 },
    { id: '2', title: 'Top skills to learn in AI/ML in 2026', author: 'Neha Patil', time: '5h ago', avatar: 'bg-emerald-400', repliesCount: 8 },
    { id: '3', title: 'SDE vs Data Scientist: Which pays more?', author: 'Rahul Verma', time: '9h ago', avatar: 'bg-blue-400', repliesCount: 15 },
    { id: '4', title: 'Best companies for work-life balance in India', author: 'Priya Nair', time: '12h ago', avatar: 'bg-purple-400', repliesCount: 22 },
  ];


  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      
      {/* 1. Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#222222] tracking-tight leading-[1.05]">
            Explore. Compare. <span className="text-[#FF5A5F]">Grow.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#484848] max-w-xl mt-2 leading-relaxed">
            Discover real salary insights, read reviews, prepare for interviews, and find the right opportunities — all in one place.
          </p>
          <HomeSearchConsole />
        </div>
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <Image
            src="/hero_armchair.png"
            alt="Hero Illustration"
            width={450}
            height={380}
            priority
            className="max-h-[380px] w-auto object-contain rounded-2xl shadow-xs"
          />
        </div>
      </div>

      {/* 2. Stats & Trust Strip */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        {/* Stat Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FF5A5F]/10 text-[#FF5A5F] rounded-full flex items-center justify-center shrink-0">
              {MinimalIcons.briefcase}
            </div>
            <div>
              <p className="text-lg font-black text-[#222222]">{totalSalaries}</p>
              <p className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">
                Verified Salaries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FF5A5F]/10 text-[#FF5A5F] rounded-full flex items-center justify-center shrink-0">
              {MinimalIcons.star}
            </div>
            <div>
              <p className="text-lg font-black text-[#222222]">{totalReviews}</p>
              <p className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">
                Verified Reviews
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FF5A5F]/10 text-[#FF5A5F] rounded-full flex items-center justify-center shrink-0">
              {MinimalIcons.building}
            </div>
            <div>
              <p className="text-lg font-black text-[#222222]">{totalCompanies}</p>
              <p className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">
                Tech Companies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FF5A5F]/10 text-[#FF5A5F] rounded-full flex items-center justify-center shrink-0">
              {MinimalIcons.interview}
            </div>
            <div>
              <p className="text-lg font-black text-[#222222]">{totalInterviews}</p>
              <p className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">
                Interview Logs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FF5A5F]/10 text-[#FF5A5F] rounded-full flex items-center justify-center shrink-0">
              {MinimalIcons.community}
            </div>
            <div>
              <p className="text-lg font-black text-[#222222]">{totalPosts}</p>
              <p className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">
                Community Threads
              </p>
            </div>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="border-t border-[#EBEBEB] pt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-[#FF5A5F] shrink-0">{MinimalIcons.shield}</span>
            <div>
              <p className="text-xs font-bold text-[#222222]">Verified & Trusted</p>
              <p className="text-[10px] text-[#717171]">Real data. Real people.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#FF5A5F] shrink-0">{MinimalIcons.globe}</span>
            <div>
              <p className="text-xs font-bold text-[#222222]">10M+ Users</p>
              <p className="text-[10px] text-[#717171]">Across the globe</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#FF5A5F] shrink-0">{MinimalIcons.building}</span>
            <div>
              <p className="text-xs font-bold text-[#222222]">500K+ Companies</p>
              <p className="text-[10px] text-[#717171]">Researched & reviewed</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#FF5A5F] shrink-0">{MinimalIcons.gift}</span>
            <div>
              <p className="text-xs font-bold text-[#222222]">100% Free</p>
              <p className="text-[10px] text-[#717171]">No hidden charges</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Intelligence Hub */}
      <div className="flex flex-col gap-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#717171]">Intelligence Hub</span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Compensation Intelligence */}
          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#FF5A5F] text-lg">
                📊
              </div>
              <h3 className="text-base font-extrabold text-[#222222]">Compensation Intelligence</h3>
              <p className="text-xs text-[#717171] leading-relaxed">
                Explore real salary data and compensation trends across roles, companies and cities.
              </p>
              
              <div className="bg-slate-50 border border-[#EBEBEB] rounded-xl p-4 mt-3 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[#717171]">Average salary in India</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-[#222222]">₹{(medianIndiaSalaryVal / 100000).toFixed(1)} LPA</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border ${
                    yoyChange >= 0
                      ? 'text-[#008A05] bg-[#008A05]/10 border-[#008A05]/20'
                      : 'text-red-600 bg-red-50 border-red-100'
                  }`}>
                    {yoyChange >= 0 ? '▲' : '▼'} {Math.abs(yoyChange)}% <span className="text-[8px] font-medium text-[#717171]">vs last year</span>
                  </span>
                </div>
                
                {/* SVG Graph */}
                <svg className="w-full h-20 mt-3" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF5A5F" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#FF5A5F" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${svgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y.toFixed(1)}`).join(' ')} L 100 40 L 0 40 Z`} fill="url(#chart-grad)" />
                  <path d={svgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y.toFixed(1)}`).join(' ')} fill="none" stroke="#FF5A5F" strokeWidth="2" strokeLinecap="round" />
                  {svgPoints.map((p, idx) => (
                    <g key={idx} className="group/dot">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="2.5"
                        className="fill-[#FF5A5F] stroke-white stroke-[0.75] cursor-pointer transition-all hover:r-4"
                      />
                      <title>{`Year ${years[idx]}: ₹${(p.val / 100000).toFixed(1)} LPA`}</title>
                    </g>
                  ))}
                </svg>
                <div className="flex justify-between items-center text-[8px] font-bold text-[#717171] mt-1 px-1">
                  {years.map(yr => (
                    <span key={yr}>{yr}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-4 text-[10px] font-bold text-[#717171]">
                <span className={yoyChange >= 0 ? "text-[#008A05]" : "text-red-500"}>
                  {yoyChange >= 0 ? '▲' : '▼'} {Math.abs(yoyChange)}% YoY Change
                </span>
                <span>Software engineers in Bangalore earn more</span>
              </div>
              <Link href="/salaries" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] flex items-center gap-1">
                Explore salaries →
              </Link>
            </div>
          </div>

          {/* Column 2: Reviews (top) & Offers (bottom) */}
          <div className="flex flex-col gap-6">
            {/* Card 2: Company Reviews & Culture */}
            <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between flex-1 group hover:border-[#FF5A5F]/40 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 text-lg">
                  ⭐
                </div>
                <h3 className="text-base font-extrabold text-[#222222]">Company Reviews & Culture</h3>
                <p className="text-xs text-[#717171] leading-relaxed">
                  Read honest reviews and discover what employees really think.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-black text-[#222222]">{avgRating}</span>
                      <span className="text-xs text-orange-500">★★★★★</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#717171]">Based on {totalReviews} reviews</span>
                  </div>
                  <div className="border-l border-[#EBEBEB] pl-4">
                    <span className="text-lg font-black text-[#222222]">{recommendPct}%</span>
                    <p className="text-[10px] font-bold text-[#717171]">Recommend to a friend</p>
                  </div>
                </div>
                {/* Company Logos */}
                <div className="flex items-center gap-3.5 mt-4">
                  <span className="text-[10px] font-bold text-[#717171]">Top rated:</span>
                  <div className="flex items-center gap-3">
                    <Image src="/logos/google.svg" alt="Google" width={20} height={20} className="h-5 w-auto object-contain" />
                    <Image src="/logos/microsoft.svg" alt="Microsoft" width={20} height={20} className="h-5 w-auto object-contain" />
                    <Image src="/logos/meta.svg" alt="Meta" width={20} height={20} className="h-5 w-auto object-contain" />
                    <Image src="/logos/amazon.svg" alt="Amazon" width={20} height={20} className="h-5 w-auto object-contain" />
                  </div>
                </div>
              </div>
              <Link href="/reviews" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] flex items-center gap-1 mt-6">
                Explore companies →
              </Link>
            </div>

            {/* Card 4: Offers & Negotiations */}
            <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between flex-1 group hover:border-[#FF5A5F]/40 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF5A5F] text-lg">
                  💼
                </div>
                <h3 className="text-base font-extrabold text-[#222222]">Offers & Negotiations</h3>
                <p className="text-xs text-[#717171] leading-relaxed">
                  See real offers, compare packages and negotiate confidently.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-slate-50 border border-[#EBEBEB] p-2.5 rounded-lg">
                    <span className="text-sm font-black text-[#222222]">{formattedMaxOffer}</span>
                    <p className="text-[9px] text-[#717171]">Highest reported total comp</p>
                  </div>
                  <div className="bg-slate-50 border border-[#EBEBEB] p-2.5 rounded-lg">
                    <span className="text-sm font-black text-[#222222]">{negotiationPct}%</span>
                    <p className="text-[9px] text-[#717171]">Have stock or bonus package</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-4 mt-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="inline-block h-4.5 w-4.5 rounded-full ring-1 ring-white bg-gradient-to-tr from-amber-400 to-rose-400" />
                    <div className="inline-block h-4.5 w-4.5 rounded-full ring-1 ring-white bg-gradient-to-tr from-blue-400 to-indigo-500" />
                    <div className="inline-block h-4.5 w-4.5 rounded-full ring-1 ring-white bg-gradient-to-tr from-emerald-400 to-teal-500" />
                  </div>
                  <span className="text-[9px] font-bold text-[#717171]">Join 120K+ professionals</span>
                </div>
                <Link href="/compare" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449]">
                  Explore offers →
                </Link>
              </div>
            </div>
          </div>

          {/* Column 3: Interviews (top) & Community (bottom) */}
          <div className="flex flex-col gap-6">
            {/* Card 3: Interview Experiences */}
            <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between flex-1 group hover:border-[#FF5A5F]/40 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 text-lg">
                  📝
                </div>
                <h3 className="text-base font-extrabold text-[#222222]">Interview Experiences</h3>
                <p className="text-xs text-[#717171] leading-relaxed">
                  Practice real interview questions shared by candidates.
                </p>
                <div className="flex items-center justify-between bg-slate-50 border border-[#EBEBEB] p-2.5 rounded-lg mt-3">
                  <div>
                    <span className="text-[9px] font-bold text-[#717171] block">Most in-demand skills</span>
                    <span className="text-[10px] font-extrabold text-[#222222]">Based on interview trends</span>
                  </div>
                  <svg className="w-16 h-6 text-[#FF5A5F]" viewBox="0 0 50 20">
                    <path d="M 0 15 Q 12 10, 25 18 T 50 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-[9px] font-bold text-[#717171] uppercase mr-1 self-center">Top Roles:</span>
                  <span className="text-[10px] font-bold text-[#484848] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">Software Engineer</span>
                  <span className="text-[10px] font-bold text-[#484848] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">Product Manager</span>
                </div>
              </div>
              <Link href="/interviews" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] flex items-center gap-1 mt-6">
                Explore interviews →
              </Link>
            </div>

            {/* Card 5: Community Discussions */}
            <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between flex-1 group hover:border-[#FF5A5F]/40 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-lg">
                  👥
                </div>
                <h3 className="text-base font-extrabold text-[#222222]">Community Discussions</h3>
                <p className="text-xs text-[#717171] leading-relaxed">
                  Join conversations, ask questions and share knowledge.
                </p>
                <div className="bg-slate-50 border border-[#EBEBEB] p-3 rounded-lg flex items-center justify-between gap-4 mt-3">
                  <span className="text-xs font-bold text-[#222222] italic text-center w-full">
                    &ldquo;How is the work-life balance at top tech companies?&rdquo;
                  </span>
                  <span className="text-xs shrink-0">✏️</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 items-center">
                  <span className="text-[9px] font-bold text-[#717171] uppercase mr-1">Trending:</span>
                  <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded">Layoffs 2024</span>
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">Work from Home</span>
                  <Link href="/community" className="text-[9px] font-bold text-[#FF5A5F] hover:underline">
                    View all
                  </Link>
                </div>
              </div>
              <Link href="/community" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] flex items-center gap-1 mt-6">
                Explore community →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Explore by what matters to you */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg sm:text-2xl font-extrabold text-[#222222] tracking-tight">
          Explore by what matters to you
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Salaries', desc: 'Discover pay by role, location and experience.', icon: MinimalIcons.salary, href: '/salaries' },
            { title: 'Reviews', desc: 'Discover what employees say about companies.', icon: MinimalIcons.star, href: '/reviews' },
            { title: 'Interviews', desc: 'Practice real questions and see your interviews.', icon: MinimalIcons.interview, href: '/interviews' },
            { title: 'Jobs', desc: 'Find the right opportunities for your career.', icon: MinimalIcons.briefcase, href: '/jobs' },
            { title: 'Offers', desc: 'Compare offers, understand compensation.', icon: MinimalIcons.compare, href: '/compare' },
            { title: 'Community', desc: 'Be a part of conversations that matter.', icon: MinimalIcons.community, href: '/community' },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group bg-white border border-[#EBEBEB] hover:border-[#FF5A5F]/40 rounded-xl p-4 flex flex-col justify-between h-36 transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-xl leading-none text-[#717171] group-hover:text-[#FF5A5F] transition-colors w-[18px] h-[18px] flex items-center justify-center shrink-0">{item.icon}</span>
                <h3 className="text-xs font-bold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] text-[#717171] leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#FF5A5F] flex items-center gap-0.5 select-none">
                Explore <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Workplace Index & Tools split row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Workplace Index */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-2">
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#FF5A5F] text-lg">
              📈
            </div>
            <h3 className="text-base font-extrabold text-[#222222]">Workplace Index</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Measure and improve workplace experience.
            </p>
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-slate-50 border border-[#EBEBEB] p-2.5 rounded-lg text-center">
                <span className="text-base font-black text-[#222222]">{avgWorkplaceScore}</span>
                <p className="text-[8px] text-[#717171] font-bold uppercase tracking-wider">Workplace Score</p>
              </div>
              <div className="bg-slate-50 border border-[#EBEBEB] p-2.5 rounded-lg text-center">
                <span className="text-base font-black text-[#222222]">{avgCultureScore}%</span>
                <p className="text-[8px] text-[#717171] font-bold uppercase tracking-wider">Positive Reviews</p>
              </div>
              <div className="bg-slate-50 border border-[#EBEBEB] p-2.5 rounded-lg text-center">
                <span className="text-base font-black text-[#222222]">{avgWfhScore}%</span>
                <p className="text-[8px] text-[#717171] font-bold uppercase tracking-wider">Recommend</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3.5 mt-4">
              <span className="text-[9px] font-bold text-[#717171]">Workplaces:</span>
              <div className="flex items-center gap-2">
                <Image src="/logos/google.svg" alt="Google" width={18} height={18} className="h-4.5 w-auto object-contain" />
                <Image src="/logos/microsoft.svg" alt="Microsoft" width={18} height={18} className="h-4.5 w-auto object-contain" />
                <Image src="/logos/meta.svg" alt="Meta" width={18} height={18} className="h-4.5 w-auto object-contain" />
              </div>
            </div>
          </div>
          <Link href="/workplace-index" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] flex items-center gap-1 mt-6">
            Explore Workplace Index →
          </Link>
        </div>

        {/* Right: Tools & Resources */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-2">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#FF5A5F] text-lg shrink-0">
              {MinimalIcons.tools}
            </div>
            <h3 className="text-base font-extrabold text-[#222222]">Tools & Resources</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Free tools to help you plan your career.
            </p>
            
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <Link href="/tools/salary-calculator" className="flex flex-col items-center gap-1.5 group/t">
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-[#EBEBEB] group-hover/t:bg-[#FF5A5F]/5 group-hover/t:border-[#FF5A5F]/20 flex items-center justify-center text-[#FF5A5F] transition-colors shrink-0">
                  {MinimalIcons.salary}
                </div>
                <span className="text-[9px] font-bold text-[#484848] leading-tight block h-6 flex items-center justify-center px-1">Salary Calc</span>
              </Link>
              <Link href="/tools/resume-analyzer" className="flex flex-col items-center gap-1.5 group/t">
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-[#EBEBEB] group-hover/t:bg-[#FF5A5F]/5 group-hover/t:border-[#FF5A5F]/20 flex items-center justify-center text-[#FF5A5F] transition-colors shrink-0">
                  {MinimalIcons.interview}
                </div>
                <span className="text-[9px] font-bold text-[#484848] leading-tight block h-6 flex items-center justify-center px-1">Resume Review</span>
              </Link>
              <Link href="/tools/offer-comparison" className="flex flex-col items-center gap-1.5 group/t">
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-[#EBEBEB] group-hover/t:bg-[#FF5A5F]/5 group-hover/t:border-[#FF5A5F]/20 flex items-center justify-center text-[#FF5A5F] transition-colors shrink-0">
                  {MinimalIcons.scale}
                </div>
                <span className="text-[9px] font-bold text-[#484848] leading-tight block h-6 flex items-center justify-center px-1">Offer Compare</span>
              </Link>
              <Link href="/tools/hike-calculator" className="flex flex-col items-center gap-1.5 group/t">
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-[#EBEBEB] group-hover/t:bg-[#FF5A5F]/5 group-hover/t:border-[#FF5A5F]/20 flex items-center justify-center text-[#FF5A5F] transition-colors shrink-0">
                  {MinimalIcons.trendingUp}
                </div>
                <span className="text-[9px] font-bold text-[#484848] leading-tight block h-6 flex items-center justify-center px-1">Hike Calc</span>
              </Link>
            </div>
          </div>
          <Link href="/tools" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] flex items-center gap-1 mt-6">
            Explore all tools →
          </Link>
        </div>
      </div>

      {/* 6. Latest insights from the community */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#222222] tracking-tight">
            Latest insights from the community
          </h2>
          <Link href="/community" className="text-xs sm:text-sm font-bold text-[#FF5A5F] hover:text-[#ff4449] select-none">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {postsToShow.map((item, idx) => (
            <Link
              key={idx}
              href={item.id !== '1' && item.id !== '2' && item.id !== '3' && item.id !== '4' ? `/community/post/${item.id}` : `/community`}
              className="group bg-white border border-[#EBEBEB] hover:border-[#FF5A5F]/40 rounded-xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between h-36 cursor-pointer"
            >
              <h3 className="text-xs sm:text-sm font-bold text-[#222222] group-hover:text-[#FF5A5F] transition-colors line-clamp-3">
                {item.title}
              </h3>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 truncate">
                  <div className={`h-6 w-6 rounded-full shrink-0 ${item.avatar} ring-1 ring-[#EBEBEB] flex items-center justify-center text-[8px] font-bold text-white uppercase`}>
                    {item.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] font-bold text-[#222222] truncate">{item.author}</p>
                    <p className="text-[8px] text-[#717171]">{item.time}</p>
                  </div>
                </div>
                {item.repliesCount !== undefined && (
                  <span className="text-[9px] font-bold text-[#717171] bg-slate-50 border border-[#EBEBEB] px-1.5 py-0.5 rounded shrink-0">
                    💬 {item.repliesCount}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 7. Heatmap & Salary by Role split row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Compensation Heatmap */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-extrabold text-[#222222]">Compensation Heatmap</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Explore salary levels across locations
            </p>
            
            {/* World Map with SVG overlay lines & dots */}
            <div className="mt-3 relative w-full h-48 bg-white rounded-xl overflow-hidden flex items-center justify-center">
              <svg className="h-full w-full" viewBox="70 0 660 400" fill="none" preserveAspectRatio="xMidYMid slice">
                {/* User's exact pink world map as backdrop */}
                <image href="/images/heatmap-world.png" x="0" y="-10" width="800" height="420" />

                {/* Connection arcs between tech hubs */}
                <path
                  d="M 160 155 Q 300 80 395 120"
                  stroke="#FF5A5F"
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M 160 155 Q 370 100 555 225"
                  stroke="#FF5A5F"
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M 395 120 Q 480 150 555 225"
                  stroke="#FF5A5F"
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M 555 225 Q 620 240 680 165"
                  stroke="#FF5A5F"
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                  fill="none"
                  opacity="0.5"
                />

                {/* Hotspot nodes */}
                {[
                  { city: 'San Francisco', cx: 160, cy: 155, dx: 0, dy: -14 },
                  { city: 'London', cx: 395, cy: 120, dx: 0, dy: -14 },
                  { city: 'Bengaluru', cx: 555, cy: 225, dx: 14, dy: 4 },
                  { city: 'Tokyo', cx: 680, cy: 165, dx: 0, dy: -14 },
                  { city: 'Sydney', cx: 710, cy: 320, dx: 0, dy: -14 },
                ].map((node, nIdx) => (
                  <g key={nIdx}>
                    {/* Pulsing ring */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="8"
                      fill="#FF5A5F"
                      className="animate-ping"
                      opacity="0.15"
                    />
                    {/* Outer white ring */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="5"
                      fill="white"
                      stroke="#FF5A5F"
                      strokeWidth="1.5"
                    />
                    {/* Center dot */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="2.5"
                      fill="#FF5A5F"
                    />
                    {/* City label */}
                    <text
                      x={node.cx + node.dx}
                      y={node.cy + node.dy}
                      textAnchor={node.dx > 0 ? 'start' : 'middle'}
                      fill="#222222"
                      fontSize="8"
                      fontWeight="800"
                      className="select-none pointer-events-none"
                    >
                      {node.city}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
          <a
            href="https://www.levels.fyi/heatmap/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] flex items-center gap-1 mt-6"
          >
            Explore heatmaps →
          </a>
        </div>

        {/* Right: Salary by Role */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-extrabold text-[#222222]">Salary by Role</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Explore average total compensation.
            </p>
            
            <div className="flex flex-col gap-3 mt-3 w-full">
              {roleAverages.map((role, idx) => (
                <div key={idx} className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-center text-xs font-bold text-[#484848]">
                    <span>{role.role}</span>
                    <span className="text-[#222222]">₹{role.lpa}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FF5A5F] h-full rounded-full transition-all"
                      style={{ width: role.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/salaries" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] flex items-center gap-1 mt-6">
            Explore all roles →
          </Link>
        </div>
      </div>

      {/* 8. Trust Footer Strip */}
      <div className="border-t border-[#EBEBEB] pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[#FF5A5F] shrink-0">{MinimalIcons.shield}</span>
          <p className="text-xs font-bold text-[#222222]">100% Anonymous</p>
          <p className="text-[10px] text-[#717171]">Your privacy is our priority</p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[#FF5A5F] shrink-0">{MinimalIcons.check}</span>
          <p className="text-xs font-bold text-[#222222]">Verified Submissions</p>
          <p className="text-[10px] text-[#717171]">Real data from real people</p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[#FF5A5F] shrink-0">{MinimalIcons.community}</span>
          <p className="text-xs font-bold text-[#222222]">Millions of Professionals</p>
          <p className="text-[10px] text-[#717171]">From 100+ countries</p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[#FF5A5F] shrink-0">{MinimalIcons.bolt}</span>
          <p className="text-xs font-bold text-[#222222]">Updated in Real-time</p>
          <p className="text-[10px] text-[#717171]">Always fresh, always relevant</p>
        </div>
      </div>

    </div>
  );
}
