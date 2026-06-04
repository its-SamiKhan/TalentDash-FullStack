import 'dotenv/config';
import { Level, Currency, Source } from '@prisma/client';
import { prisma } from '../src/lib/prisma';

const companiesData = [
  {
    name: 'Google',
    slug: 'google',
    normalizedName: 'google',
    industry: 'Technology',
    headquarters: 'Mountain View',
    foundedYear: 1998,
    headcountRange: '10,001+',
    logoUrl: '/logos/google.svg',
  },
  {
    name: 'Amazon',
    slug: 'amazon',
    normalizedName: 'amazon',
    industry: 'E-Commerce / Cloud',
    headquarters: 'Seattle',
    foundedYear: 1994,
    headcountRange: '10,001+',
    logoUrl: '/logos/amazon.svg',
  },
  {
    name: 'Meta',
    slug: 'meta',
    normalizedName: 'meta',
    industry: 'Social Media',
    headquarters: 'Menlo Park',
    foundedYear: 2004,
    headcountRange: '10,001+',
    logoUrl: '/logos/meta.svg',
  },
  {
    name: 'Microsoft',
    slug: 'microsoft',
    normalizedName: 'microsoft',
    industry: 'Technology',
    headquarters: 'Redmond',
    foundedYear: 1975,
    headcountRange: '10,001+',
    logoUrl: '/logos/microsoft.svg',
  },
  {
    name: 'Flipkart',
    slug: 'flipkart',
    normalizedName: 'flipkart',
    industry: 'E-Commerce',
    headquarters: 'Bengaluru',
    foundedYear: 2007,
    headcountRange: '10,001+',
    logoUrl: '/logos/flipkart.svg',
  },
  {
    name: 'Meesho',
    slug: 'meesho',
    normalizedName: 'meesho',
    industry: 'E-Commerce',
    headquarters: 'Bengaluru',
    foundedYear: 2015,
    headcountRange: '1,001-5,000',
    logoUrl: '/logos/meesho.svg',
  },
  {
    name: 'NVIDIA',
    slug: 'nvidia',
    normalizedName: 'nvidia',
    industry: 'Semiconductors',
    headquarters: 'Santa Clara',
    foundedYear: 1993,
    headcountRange: '10,001+',
    logoUrl: '/logos/nvidia.svg',
  },
  {
    name: 'Razorpay',
    slug: 'razorpay',
    normalizedName: 'razorpay',
    industry: 'Fintech',
    headquarters: 'Bengaluru',
    foundedYear: 2014,
    headcountRange: '1,001-5,000',
    logoUrl: '/logos/razorpay.svg',
  },
  {
    name: 'Zepto',
    slug: 'zepto',
    normalizedName: 'zepto',
    industry: 'Quick Commerce',
    headquarters: 'Mumbai',
    foundedYear: 2021,
    headcountRange: '1,001-5,000',
    logoUrl: '/logos/zepto.svg',
  },
  {
    name: 'TCS',
    slug: 'tcs',
    normalizedName: 'tcs',
    industry: 'IT Services',
    headquarters: 'Mumbai',
    foundedYear: 1968,
    headcountRange: '10,001+',
    logoUrl: '/logos/tcs.svg',
  },
  {
    name: 'Infosys',
    slug: 'infosys',
    normalizedName: 'infosys',
    industry: 'IT Services',
    headquarters: 'Bengaluru',
    foundedYear: 1981,
    headcountRange: '10,001+',
    logoUrl: '/logos/infosys.svg',
  },
  {
    name: 'Wipro',
    slug: 'wipro',
    normalizedName: 'wipro',
    industry: 'IT Services',
    headquarters: 'Bengaluru',
    foundedYear: 1945,
    headcountRange: '10,001+',
    logoUrl: '/logos/wipro.svg',
  },
];

// ─── Procedural Seeding Templates & Parameters ───────────

const ROLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Principal Engineer',
  'Architect',
  'SDE I',
  'SDE II',
  'SDE III',
  'Systems Engineer',
  'Product Manager',
  'Engineering Manager',
];

const LOCATIONS = [
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Noida',
  'Gurugram',
  'Chennai',
  'Mountain View',
  'Seattle',
  'London',
  'San Francisco',
];

const LEVEL_RANGES: Record<
  Level,
  { minBase: number; maxBase: number; stockPct: number; bonusPct: number }
> = {
  L3: { minBase: 1200000, maxBase: 2200000, stockPct: 0.15, bonusPct: 0.10 },
  L4: { minBase: 2200000, maxBase: 3500000, stockPct: 0.20, bonusPct: 0.12 },
  L5: { minBase: 3500000, maxBase: 5500000, stockPct: 0.25, bonusPct: 0.15 },
  L6: { minBase: 5500000, maxBase: 8000000, stockPct: 0.30, bonusPct: 0.18 },
  SDE_I: { minBase: 1000000, maxBase: 1800000, stockPct: 0.12, bonusPct: 0.10 },
  SDE_II: { minBase: 1800000, maxBase: 3000000, stockPct: 0.18, bonusPct: 0.12 },
  SDE_III: { minBase: 3000000, maxBase: 5000000, stockPct: 0.25, bonusPct: 0.15 },
  STAFF: { minBase: 5000000, maxBase: 7500000, stockPct: 0.30, bonusPct: 0.18 },
  PRINCIPAL: { minBase: 7500000, maxBase: 12000000, stockPct: 0.40, bonusPct: 0.20 },
  IC4: { minBase: 2000000, maxBase: 3200000, stockPct: 0.18, bonusPct: 0.12 },
  IC5: { minBase: 3200000, maxBase: 5000000, stockPct: 0.25, bonusPct: 0.15 },
};

const PROS = [
  'Great work life balance and flexibility to work hybrid.',
  'Excellent compensation package with periodic stock refreshes.',
  'Super smart colleagues, high engineering standards and ownership.',
  'Great insurance coverage, free meals, and gym benefits.',
  'Strong focus on employee wellness and generous parental leave.',
  'Massive scale of operations, learn a lot about high-availability systems.',
  'Very supportive management and clear career progression pathways.',
  'Modern tech stack, fast-paced shipping and no corporate red tape.',
  'Good learning opportunities for early-career developers.',
];

const CONS = [
  'Promotions can be slow and depend heavily on visibility.',
  'High pressure environment with occasional weekend deployment calls.',
  'Management hierarchy is thick, lots of alignment meetings needed.',
  'Base salary is competitive but stock components are on a 4-year vest cliff.',
  'WLB is highly team-dependent; infrastructure teams carry heavy on-call loads.',
  'No variable bonus payout this year due to macroeconomic conditions.',
  'The office location is far from the city center, commute is bad.',
  'Frequent re-organizations make it hard to focus on long-term projects.',
  'Lack of structured onboarding for fresh college grads.',
];

const TITLES = [
  'Great learning curve but high stress',
  'Solid workplace with great compensation',
  'Bureaucracy is thick but benefits make it worth it',
  'Smart people and high scale challenges',
  'On-call rotation is killer, otherwise decent',
  'Supportive managers and great flexibility',
  'Decent WLB and good hybrid policy',
  'Fast paced environment with zero bureaucracy',
  'Average pay but solid work-life balance',
];

const INTERVIEW_EXPERIENCES = [
  'First round was a resume screening followed by a phone coding round. Then 3 virtual onsite rounds covering system design, coding, and behavioral checks.',
  'Applied online, got hacker earth coding link. Had 3 coding questions on arrays, trees, and dynamic programming. Later had a manager round.',
  'Recruiter reached out via LinkedIn. The loop consisted of 1 machine coding round, 1 design round, and 1 engineering manager discussion.',
  'Standard loop. Machine coding round to implement a splitwise-like ledger, followed by a system design discussion on designing a URL shortener.',
  'Process was smooth. 2 rounds of LC medium questions, 1 round of low-level design (LLD) for parking lot, and 1 round of behavioral questions.',
];

const QUESTIONS_TEMPLATES = [
  '1. Implement a rate limiter middleware for API calls.\n2. Design a system to push notifications to millions of users in real time.\n3. Reverse a linked list in groups of K.',
  '1. Design a distributed cache like Redis.\n2. Find the longest path in a directed acyclic graph.\n3. How do you handle database sharding?',
  '1. Design a parking lot system with clean OOP principles.\n2. Explain dynamic programming vs memoization.\n3. What is the CAP theorem?',
  '1. How does a database transaction isolation level work?\n2. Implement a circular queue in Java.\n3. Explain load balancer routing algorithms.',
  '1. Write an SQL query to find second highest salary.\n2. Design a messaging app like WhatsApp.\n3. What are Java virtual threads?',
];

const THREAD_TEMPLATES = [
  {
    topic: 'layoffs',
    title: 'Are layoffs coming to tech service firms in India?',
    body: 'Seeing small budget cuts in multiple projects at TCS and Wipro. Clients are refusing to renew contracts. Anyone in delivery manager roles seeing actual headcount reductions?',
    comments: [
      'Yes, bench strengths are being pruned aggressively. Freshers are not being boarded on time.',
      'Mostly contract staff are being let go first. Full-time employees are safe for now but raises are delayed.',
      'Can confirm. Heard Wipro is cutting bench sizes by 10% in the current quarter.',
    ],
  },
  {
    topic: 'compensation',
    title: 'NVIDIA Bangalore TC for Senior Engineer?',
    body: 'Received an offer from NVIDIA Bangalore for Senior ASIC Design Engineer. 42L base + 20L stock grants per year. Is this good or can I negotiate for higher stocks?',
    comments: [
      'That is inline. NVIDIA stocks have gone crazy, so stock component is high-value. Take it.',
      'Base can be pushed to 45L if you have competing offers from Qualcomm or Intel.',
      'Good offer, definitely accept. Stock refreshers are very generous at NV.',
    ],
  },
  {
    topic: 'interview-prep',
    title: 'Best resources for machine coding rounds?',
    body: 'Preparing for Flipkart/Razorpay SDE-II loops. Everyone says machine coding is the filter round. Where do I find good mock questions and design pattern templates?',
    comments: [
      'Check out WorkAtTech or code library articles on low level design.',
      'Practice coding clean, extensible models. Separation of concerns is what they check.',
      'Write a working demo on your local machine with console logs representing test scenarios. Time yourself for 90 minutes.',
    ],
  },
  {
    topic: 'careers',
    title: 'Zepto WLB vs Google?',
    body: 'Currently at Google L4, WLB is great but work is slow and promo is delayed. Got Zepto SDE-II offer with 35% hike. Is the crazy WLB at Zepto worth the learning?',
    comments: [
      'If you are young and want high growth, Zepto is unmatched. If you want peace, stay at Google.',
      'Zepto is literally 12-14 hours a day. Be ready for burnout in 1 year.',
      'Growth is huge at Zepto, but Google branding on resume is great too. Hard choice.',
    ],
  },
  {
    topic: 'tech-talk',
    title: 'Next.js 16 Server Actions vs traditional REST APIs?',
    body: 'For a new greenfield project, should we use Next.js 16 with Server Actions or separate Node/Express backend? Next.js App router feels very integrated but tight coupling scares me.',
    comments: [
      'Server Actions are great for simple form submissions but harder to test in isolation.',
      'Separate Node/Express backend gives you mobile app readiness out of the box.',
      'We built our MVP on Server Actions and it cut dev time by half. Highly recommend for fast validation.',
    ],
  },
];

// ─── Utility Generators ──────────────────────────────────

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function getBaseSalaryForLevel(level: Level, currency: Currency): bigint {
  const range = LEVEL_RANGES[level];
  const baseINR = getRandomInt(range.minBase, range.maxBase);
  if (currency === Currency.USD) {
    return BigInt(Math.floor(baseINR / 83));
  } else if (currency === Currency.GBP) {
    return BigInt(Math.floor(baseINR / 105));
  } else if (currency === Currency.EUR) {
    return BigInt(Math.floor(baseINR / 90));
  }
  return BigInt(baseINR);
}

// ─── Seeding Script ──────────────────────────────────────

async function main() {
  console.log('Starting programmatic seeding...');

  // Clear existing database tables
  await prisma.salary.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.interview.deleteMany({});
  await prisma.communityComment.deleteMany({});
  await prisma.communityPost.deleteMany({});
  await prisma.workplaceScore.deleteMany({});
  await prisma.company.deleteMany({});

  console.log('Database cleared.');

  // 1. Create Companies
  const companySlugToIdMap: Record<string, string> = {};
  for (const cData of companiesData) {
    const company = await prisma.company.create({ data: cData });
    companySlugToIdMap[company.slug] = company.id;
  }
  console.log(`Seeded ${companiesData.length} companies.`);

  // 2. Generate 220+ Salaries
  let salaryCount = 0;
  for (let i = 0; i < 220; i++) {
    const companySlug = getRandomElement(companiesData).slug;
    const companyId = companySlugToIdMap[companySlug];
    const role = getRandomElement(ROLES);
    const location = getRandomElement(LOCATIONS);

    let currency: Currency = Currency.INR;
    if (['Mountain View', 'Seattle', 'San Francisco'].includes(location)) {
      currency = Currency.USD;
    } else if (location === 'London') {
      currency = Currency.GBP;
    }

    const level = getRandomElement(Object.keys(LEVEL_RANGES) as Level[]);
    const base = getBaseSalaryForLevel(level, currency);
    const range = LEVEL_RANGES[level];

    const bonus = BigInt(
      Math.floor(Number(base) * range.bonusPct * (0.8 + Math.random() * 0.4))
    );
    const stock = BigInt(
      Math.floor(Number(base) * range.stockPct * (0.5 + Math.random() * 1.0))
    );
    const totalCompensation = base + bonus + stock;

    const experienceYears = getRandomInt(1, 15);
    const isVerified = Math.random() > 0.3;
    const source = getRandomElement([
      Source.CONTRIBUTOR,
      Source.SCRAPED,
      Source.AI_INFERRED,
    ]);

    await prisma.salary.create({
      data: {
        companyId,
        role,
        level,
        location,
        currency,
        experienceYears,
        baseSalary: base,
        bonus,
        stock,
        totalCompensation,
        source,
        confidenceScore: isVerified ? 0.98 : getRandomFloat(0.5, 0.9),
        isVerified,
        submittedAt: new Date(Date.now() - getRandomInt(0, 180) * 24 * 3600 * 1000),
      },
    });
    salaryCount++;
  }
  console.log(`Seeded ${salaryCount} salaries dynamically.`);

  // 3. Generate 110+ Reviews
  let reviewCount = 0;
  for (let i = 0; i < 110; i++) {
    const companySlug = getRandomElement(companiesData).slug;
    const companyId = companySlugToIdMap[companySlug];
    const role = getRandomElement(ROLES);

    let baseRating = 3;
    if (['google', 'meta', 'nvidia', 'microsoft'].includes(companySlug)) {
      baseRating = 4;
    } else if (['tcs', 'infosys', 'wipro'].includes(companySlug)) {
      baseRating = 3;
    }

    const rating = Math.min(5, Math.max(1, baseRating + getRandomInt(-1, 1)));
    const workLifeBalance = Math.min(
      5,
      Math.max(1, (companySlug === 'zepto' ? 2 : 4) + getRandomInt(-1, 1))
    );
    const managementQuality = Math.min(5, Math.max(1, baseRating + getRandomInt(-1, 1)));
    const growthOpportunities = Math.min(
      5,
      Math.max(1, (companySlug === 'zepto' ? 5 : 3) + getRandomInt(-1, 1))
    );
    const cultureFit = Math.min(5, Math.max(1, baseRating + getRandomInt(-1, 1)));

    await prisma.review.create({
      data: {
        companyId,
        role,
        rating,
        workLifeBalance,
        managementQuality,
        growthOpportunities,
        cultureFit,
        title: getRandomElement(TITLES),
        pros: getRandomElement(PROS) + ' ' + getRandomElement(PROS),
        cons: getRandomElement(CONS) + ' ' + getRandomElement(CONS),
        isAnonymous: true,
        createdAt: new Date(Date.now() - getRandomInt(0, 180) * 24 * 3600 * 1000),
      },
    });
    reviewCount++;
  }
  console.log(`Seeded ${reviewCount} reviews dynamically.`);

  // 4. Generate 110+ Interviews
  let interviewCount = 0;
  for (let i = 0; i < 110; i++) {
    const companySlug = getRandomElement(companiesData).slug;
    const companyId = companySlugToIdMap[companySlug];
    const role = getRandomElement(ROLES);

    const difficulty = getRandomInt(2, 4);
    const rounds = getRandomInt(2, 5);
    const outcome = getRandomElement(['OFFER', 'REJECT', 'GHOSTED']);

    await prisma.interview.create({
      data: {
        companyId,
        role,
        difficulty,
        rounds,
        outcome,
        experience: getRandomElement(INTERVIEW_EXPERIENCES),
        questions: getRandomElement(QUESTIONS_TEMPLATES),
        isAnonymous: true,
        createdAt: new Date(Date.now() - getRandomInt(0, 180) * 24 * 3600 * 1000),
      },
    });
    interviewCount++;
  }
  console.log(`Seeded ${interviewCount} interview records dynamically.`);

  // 5. Generate 50+ Community Posts & Comments
  let postCount = 0;
  let commentCount = 0;
  for (let i = 0; i < 50; i++) {
    const template = getRandomElement(THREAD_TEMPLATES);
    const companySlug = Math.random() > 0.5 ? getRandomElement(companiesData).slug : null;
    const companyId = companySlug ? companySlugToIdMap[companySlug] : null;

    let title = template.title;
    let body = template.body;

    if (companySlug) {
      const companyName =
        companiesData.find((c) => c.slug === companySlug)?.name || 'this company';
      title = title.replace(/(Google|NVIDIA|Flipkart|Zepto)/g, companyName);
      body = body.replace(/(Google|NVIDIA|Flipkart|Zepto|TCS|Wipro)/g, companyName);
    }

    const post = await prisma.communityPost.create({
      data: {
        companyId,
        topic: companySlug ? null : template.topic,
        title: `${title} (#${i + 1})`,
        body,
        createdAt: new Date(Date.now() - getRandomInt(0, 90) * 24 * 3600 * 1000),
      },
    });

    const numComments = getRandomInt(1, 3);
    for (let c = 0; c < numComments; c++) {
      await prisma.communityComment.create({
        data: {
          postId: post.id,
          body: getRandomElement(template.comments),
          createdAt: new Date(post.createdAt.getTime() + getRandomInt(1, 48) * 3600 * 1000),
        },
      });
      commentCount++;
    }
    postCount++;
  }
  console.log(`Seeded ${postCount} forum posts with ${commentCount} nested replies.`);

  // 6. Seed Workplace Score Profiles
  const workplaceScoresData = [
    { companySlug: 'nvidia', compensationFairness: 4.9, careerGrowth: 4.8, workLifeBalance: 3.9, diversityInclusion: 4.4, leadershipQuality: 4.7, cultureScore: 4.6, wfhScore: 4.0, overallScore: 4.8 },
    { companySlug: 'google', compensationFairness: 4.7, careerGrowth: 4.5, workLifeBalance: 4.1, diversityInclusion: 4.6, leadershipQuality: 4.3, cultureScore: 4.5, wfhScore: 4.4, overallScore: 4.7 },
    { companySlug: 'meta', compensationFairness: 4.8, careerGrowth: 4.6, workLifeBalance: 3.7, diversityInclusion: 4.5, leadershipQuality: 4.2, cultureScore: 4.2, wfhScore: 4.1, overallScore: 4.6 },
    { companySlug: 'microsoft', compensationFairness: 4.5, careerGrowth: 4.2, workLifeBalance: 4.3, diversityInclusion: 4.5, leadershipQuality: 4.2, cultureScore: 4.4, wfhScore: 4.5, overallScore: 4.5 },
    { companySlug: 'amazon', compensationFairness: 4.4, careerGrowth: 4.4, workLifeBalance: 3.0, diversityInclusion: 4.2, leadershipQuality: 3.9, cultureScore: 3.8, wfhScore: 3.5, overallScore: 4.2 },
    { companySlug: 'razorpay', compensationFairness: 4.1, careerGrowth: 4.3, workLifeBalance: 3.6, diversityInclusion: 4.1, leadershipQuality: 4.0, cultureScore: 4.0, wfhScore: 3.8, overallScore: 4.1 },
    { companySlug: 'flipkart', compensationFairness: 4.0, careerGrowth: 4.2, workLifeBalance: 3.5, diversityInclusion: 4.0, leadershipQuality: 3.8, cultureScore: 3.9, wfhScore: 3.5, overallScore: 4.0 },
    { companySlug: 'zepto', compensationFairness: 4.2, careerGrowth: 4.6, workLifeBalance: 2.5, diversityInclusion: 3.7, leadershipQuality: 3.9, cultureScore: 3.6, wfhScore: 2.0, overallScore: 3.9 },
    { companySlug: 'meesho', compensationFairness: 3.9, careerGrowth: 4.1, workLifeBalance: 3.3, diversityInclusion: 3.9, leadershipQuality: 3.7, cultureScore: 3.8, wfhScore: 3.0, overallScore: 3.8 },
    { companySlug: 'tcs', compensationFairness: 3.1, careerGrowth: 3.2, workLifeBalance: 4.2, diversityInclusion: 4.0, leadershipQuality: 3.5, cultureScore: 3.6, wfhScore: 3.8, overallScore: 3.4 },
    { companySlug: 'infosys', compensationFairness: 3.2, careerGrowth: 3.1, workLifeBalance: 4.0, diversityInclusion: 4.0, leadershipQuality: 3.4, cultureScore: 3.5, wfhScore: 3.6, overallScore: 3.3 },
    { companySlug: 'wipro', compensationFairness: 3.0, careerGrowth: 3.0, workLifeBalance: 3.9, diversityInclusion: 3.9, leadershipQuality: 3.3, cultureScore: 3.4, wfhScore: 3.5, overallScore: 3.2 },
  ];

  let scoreCount = 0;
  for (const wData of workplaceScoresData) {
    const companyId = companySlugToIdMap[wData.companySlug];
    if (companyId) {
      await prisma.workplaceScore.create({
        data: {
          companyId,
          compensationFairness: wData.compensationFairness,
          careerGrowth: wData.careerGrowth,
          workLifeBalance: wData.workLifeBalance,
          diversityInclusion: wData.diversityInclusion,
          leadershipQuality: wData.leadershipQuality,
          cultureScore: wData.cultureScore,
          wfhScore: wData.wfhScore,
          overallScore: wData.overallScore,
        },
      });
      scoreCount++;
    }
  }
  console.log(`Seeded ${scoreCount} workplace scores.`);
  console.log('Database seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
