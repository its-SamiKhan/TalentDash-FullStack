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

const rawSalariesData = [
  // Google
  { companySlug: 'google', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experienceYears: 2, base: BigInt(1800000), bonus: BigInt(200000), stock: BigInt(400000) },
  { companySlug: 'google', role: 'Senior Software Engineer', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experienceYears: 6, base: BigInt(4500000), bonus: BigInt(900000), stock: BigInt(2500000) },
  { companySlug: 'google', role: 'SDE III', level: Level.L5, location: 'Hyderabad', currency: Currency.INR, experienceYears: 7, base: BigInt(4200000), bonus: BigInt(800000), stock: BigInt(2000000) },
  { companySlug: 'google', role: 'Staff Software Engineer', level: Level.L6, location: 'Mountain View', currency: Currency.USD, experienceYears: 12, base: BigInt(260000), bonus: BigInt(50000), stock: BigInt(350000) },
  { companySlug: 'google', role: 'SDE I', level: Level.L3, location: 'Hyderabad', currency: Currency.INR, experienceYears: 1, base: BigInt(1700000), bonus: BigInt(150000), stock: BigInt(300000) },
  { companySlug: 'google', role: 'Software Engineer II', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experienceYears: 4, base: BigInt(2800000), bonus: BigInt(350000), stock: BigInt(800000) },
  { companySlug: 'google', role: 'Principal Architect', level: Level.PRINCIPAL, location: 'Mountain View', currency: Currency.USD, experienceYears: 15, base: BigInt(310000), bonus: BigInt(90000), stock: BigInt(550000) },

  // Amazon
  { companySlug: 'amazon', role: 'SDE I', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experienceYears: 1, base: BigInt(1600000), bonus: BigInt(350000), stock: BigInt(250000) },
  { companySlug: 'amazon', role: 'SDE II', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experienceYears: 4, base: BigInt(3200000), bonus: BigInt(300000), stock: BigInt(600000) },
  { companySlug: 'amazon', role: 'SDE III', level: Level.L5, location: 'Hyderabad', currency: Currency.INR, experienceYears: 8, base: BigInt(5000000), bonus: BigInt(500000), stock: BigInt(1200000) },
  { companySlug: 'amazon', role: 'Software Engineer I', level: Level.SDE_I, location: 'Hyderabad', currency: Currency.INR, experienceYears: 2, base: BigInt(1500000), bonus: BigInt(300000), stock: BigInt(200000) },
  { companySlug: 'amazon', role: 'Solutions Architect', level: Level.L4, location: 'Pune', currency: Currency.INR, experienceYears: 5, base: BigInt(2400000), bonus: BigInt(250000), stock: BigInt(400000) },
  { companySlug: 'amazon', role: 'Principal Engineer', level: Level.PRINCIPAL, location: 'Seattle', currency: Currency.USD, experienceYears: 14, base: BigInt(220000), bonus: BigInt(80000), stock: BigInt(300000) },
  { companySlug: 'amazon', role: 'SDET II', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experienceYears: 3, base: BigInt(2800000), bonus: BigInt(200000), stock: BigInt(450000) },

  // Meta
  { companySlug: 'meta', role: 'SDE II', level: Level.IC4, location: 'London', currency: Currency.GBP, experienceYears: 4, base: BigInt(95000), bonus: BigInt(15000), stock: BigInt(50000) },
  { companySlug: 'meta', role: 'Production Engineer', level: Level.IC5, location: 'Menlo Park', currency: Currency.USD, experienceYears: 7, base: BigInt(190000), bonus: BigInt(30000), stock: BigInt(120000) },
  { companySlug: 'meta', role: 'Staff Engineer', level: Level.L6, location: 'Menlo Park', currency: Currency.USD, experienceYears: 11, base: BigInt(250000), bonus: BigInt(50000), stock: BigInt(350000) },
  { companySlug: 'meta', role: 'Front End Engineer', level: Level.IC4, location: 'Bengaluru', currency: Currency.INR, experienceYears: 3, base: BigInt(3800000), bonus: BigInt(400000), stock: BigInt(1200000) },
  { companySlug: 'meta', role: 'Research Scientist', level: Level.IC5, location: 'Paris', currency: Currency.EUR, experienceYears: 6, base: BigInt(110000), bonus: BigInt(20000), stock: BigInt(80000) },

  // Microsoft
  { companySlug: 'microsoft', role: 'SDE I', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experienceYears: 2, base: BigInt(1500000), bonus: BigInt(150000), stock: BigInt(200000) },
  { companySlug: 'microsoft', role: 'SDE II', level: Level.SDE_II, location: 'Hyderabad', currency: Currency.INR, experienceYears: 5, base: BigInt(2700000), bonus: BigInt(250000), stock: BigInt(400000) },
  { companySlug: 'microsoft', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experienceYears: 8, base: BigInt(4000000), bonus: BigInt(400000), stock: BigInt(800000) },
  { companySlug: 'microsoft', role: 'Principal SDE', level: Level.PRINCIPAL, location: 'Redmond', currency: Currency.USD, experienceYears: 13, base: BigInt(220000), bonus: BigInt(60000), stock: BigInt(180000) },
  { companySlug: 'microsoft', role: 'Software Engineer', level: Level.L3, location: 'Pune', currency: Currency.INR, experienceYears: 1, base: BigInt(1400000), bonus: BigInt(120000), stock: BigInt(150000) },
  { companySlug: 'microsoft', role: 'Senior SDE', level: Level.STAFF, location: 'Hyderabad', currency: Currency.INR, experienceYears: 10, base: BigInt(4500000), bonus: BigInt(500000), stock: BigInt(1100000) },

  // Flipkart
  { companySlug: 'flipkart', role: 'SDE I', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experienceYears: 2, base: BigInt(1800000), bonus: BigInt(180000), stock: BigInt(150000) },
  { companySlug: 'flipkart', role: 'SDE II', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experienceYears: 4, base: BigInt(3200000), bonus: BigInt(320000), stock: BigInt(400000) },
  { companySlug: 'flipkart', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experienceYears: 7, base: BigInt(4800000), bonus: BigInt(480000), stock: BigInt(800000) },
  { companySlug: 'flipkart', role: 'UI Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experienceYears: 3, base: BigInt(2500000), bonus: BigInt(250000), stock: BigInt(300000) },
  { companySlug: 'flipkart', role: 'Architect', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experienceYears: 10, base: BigInt(6000000), bonus: BigInt(600000), stock: BigInt(1200000) },

  // Meesho
  { companySlug: 'meesho', role: 'SDE I', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experienceYears: 2, base: BigInt(1600000), bonus: BigInt(0), stock: BigInt(200000) },
  { companySlug: 'meesho', role: 'SDE II', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experienceYears: 4, base: BigInt(2800000), bonus: BigInt(0), stock: BigInt(400000) },
  { companySlug: 'meesho', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experienceYears: 8, base: BigInt(4200000), bonus: BigInt(0), stock: BigInt(700000) },
  { companySlug: 'meesho', role: 'Senior Frontend Developer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experienceYears: 5, base: BigInt(2600000), bonus: BigInt(0), stock: BigInt(300000) },

  // NVIDIA
  { companySlug: 'nvidia', role: 'Hardware Engineer', level: Level.IC4, location: 'Pune', currency: Currency.INR, experienceYears: 3, base: BigInt(2200000), bonus: BigInt(300000), stock: BigInt(400000) },
  { companySlug: 'nvidia', role: 'Senior System Architect', level: Level.IC5, location: 'Santa Clara', currency: Currency.USD, experienceYears: 9, base: BigInt(210000), bonus: BigInt(40000), stock: BigInt(180000) },
  { companySlug: 'nvidia', role: 'ASIC Design Engineer', level: Level.IC4, location: 'Bengaluru', currency: Currency.INR, experienceYears: 4, base: BigInt(2600000), bonus: BigInt(350000), stock: BigInt(500000) },
  { companySlug: 'nvidia', role: 'Software Engineer', level: Level.L3, location: 'Santa Clara', currency: Currency.USD, experienceYears: 2, base: BigInt(140000), bonus: BigInt(20000), stock: BigInt(60000) },
  { companySlug: 'nvidia', role: 'Principal HW Engineer', level: Level.PRINCIPAL, location: 'Santa Clara', currency: Currency.USD, experienceYears: 13, base: BigInt(250000), bonus: BigInt(50000), stock: BigInt(300000) },

  // Razorpay
  { companySlug: 'razorpay', role: 'SDE I', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experienceYears: 1, base: BigInt(1400000), bonus: BigInt(100000), stock: BigInt(150000) },
  { companySlug: 'razorpay', role: 'SDE II', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experienceYears: 4, base: BigInt(2400000), bonus: BigInt(200000), stock: BigInt(300000) },
  { companySlug: 'razorpay', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experienceYears: 7, base: BigInt(3600000), bonus: BigInt(300000), stock: BigInt(600000) },
  { companySlug: 'razorpay', role: 'Engineering Manager', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experienceYears: 11, base: BigInt(4800000), bonus: BigInt(400000), stock: BigInt(900000) },

  // Zepto
  { companySlug: 'zepto', role: 'SDE II', level: Level.SDE_II, location: 'Mumbai', currency: Currency.INR, experienceYears: 3, base: BigInt(3000000), bonus: BigInt(0), stock: BigInt(400000) },
  { companySlug: 'zepto', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experienceYears: 6, base: BigInt(4500000), bonus: BigInt(0), stock: BigInt(800000) },
  { companySlug: 'zepto', role: 'Senior QA Engineer', level: Level.SDE_II, location: 'Mumbai', currency: Currency.INR, experienceYears: 5, base: BigInt(2000000), bonus: BigInt(0), stock: BigInt(200000) },

  // TCS
  { companySlug: 'tcs', role: 'Assistant Systems Engineer', level: Level.SDE_I, location: 'Pune', currency: Currency.INR, experienceYears: 1, base: BigInt(400000), bonus: BigInt(20000), stock: BigInt(0) },
  { companySlug: 'tcs', role: 'Systems Engineer', level: Level.SDE_I, location: 'Mumbai', currency: Currency.INR, experienceYears: 2, base: BigInt(450000), bonus: BigInt(30000), stock: BigInt(0) },
  { companySlug: 'tcs', role: 'IT Analyst', level: Level.SDE_II, location: 'Chennai', currency: Currency.INR, experienceYears: 5, base: BigInt(750000), bonus: BigInt(50000), stock: BigInt(0) },
  { companySlug: 'tcs', role: 'Ast. Consultant', level: Level.SDE_III, location: 'Kolkata', currency: Currency.INR, experienceYears: 8, base: BigInt(1200000), bonus: BigInt(80000), stock: BigInt(0) },
  { companySlug: 'tcs', role: 'Senior Developer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experienceYears: 4, base: BigInt(850000), bonus: BigInt(60000), stock: BigInt(0) },
  { companySlug: 'tcs', role: 'Consultant', level: Level.STAFF, location: 'Delhi', currency: Currency.INR, experienceYears: 12, base: BigInt(1800000), bonus: BigInt(120000), stock: BigInt(0) },
  { companySlug: 'tcs', role: 'Tech Lead', level: Level.SDE_III, location: 'Hyderabad', currency: Currency.INR, experienceYears: 6, base: BigInt(1300000), bonus: BigInt(90000), stock: BigInt(0) },

  // Infosys
  { companySlug: 'infosys', role: 'Systems Engineer', level: Level.SDE_I, location: 'Mysore', currency: Currency.INR, experienceYears: 1, base: BigInt(380000), bonus: BigInt(20000), stock: BigInt(0) },
  { companySlug: 'infosys', role: 'Senior Systems Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experienceYears: 2, base: BigInt(480000), bonus: BigInt(30000), stock: BigInt(0) },
  { companySlug: 'infosys', role: 'Technology Analyst', level: Level.SDE_II, location: 'Pune', currency: Currency.INR, experienceYears: 4, base: BigInt(680000), bonus: BigInt(40000), stock: BigInt(0) },
  { companySlug: 'infosys', role: 'Technology Lead', level: Level.SDE_III, location: 'Hyderabad', currency: Currency.INR, experienceYears: 7, base: BigInt(1050000), bonus: BigInt(70000), stock: BigInt(0) },
  { companySlug: 'infosys', role: 'Principal Consultant', level: Level.PRINCIPAL, location: 'Bengaluru', currency: Currency.INR, experienceYears: 14, base: BigInt(2400000), bonus: BigInt(200000), stock: BigInt(0) },

  // Wipro
  { companySlug: 'wipro', role: 'Project Engineer', level: Level.SDE_I, location: 'Hyderabad', currency: Currency.INR, experienceYears: 1, base: BigInt(380000), bonus: BigInt(15000), stock: BigInt(0) },
  { companySlug: 'wipro', role: 'Senior Project Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experienceYears: 3, base: BigInt(460000), bonus: BigInt(25000), stock: BigInt(0) },
  { companySlug: 'wipro', role: 'Team Leader', level: Level.SDE_II, location: 'Kochi', currency: Currency.INR, experienceYears: 5, base: BigInt(720000), bonus: BigInt(45000), stock: BigInt(0) },
  { companySlug: 'wipro', role: 'Project Manager', level: Level.STAFF, location: 'Pune', currency: Currency.INR, experienceYears: 10, base: BigInt(1600000), bonus: BigInt(100000), stock: BigInt(0) },
  { companySlug: 'wipro', role: 'Technical Specialist', level: Level.SDE_III, location: 'Chennai', currency: Currency.INR, experienceYears: 6, base: BigInt(1100000), bonus: BigInt(70000), stock: BigInt(0) },
];

const rawReviewsData = [
  {
    companySlug: 'google',
    role: 'Software Engineer',
    rating: 4,
    workLifeBalance: 4,
    managementQuality: 4,
    growthOpportunities: 3,
    cultureFit: 5,
    title: 'Excellent benefits and culture but slow promotions',
    pros: 'The food, medical benefits, and office perks are top-notch. You get to work with incredibly smart people on very large scale systems.',
    cons: 'Promotion processes are notoriously slow and political. Getting approvals for new projects involves a lot of red tape.',
  },
  {
    companySlug: 'google',
    role: 'SDE II',
    rating: 5,
    workLifeBalance: 5,
    managementQuality: 5,
    growthOpportunities: 4,
    cultureFit: 5,
    title: 'Amazing work-life balance and learning curve',
    pros: 'Work-life balance is extremely respected here. High standard of engineering excellence, code reviews are very educational.',
    cons: 'Siloed teams sometimes lead to duplicate work. Compensation has standard increments unless you jump levels.',
  },
  {
    companySlug: 'amazon',
    role: 'SDE II',
    rating: 3,
    workLifeBalance: 2,
    managementQuality: 3,
    growthOpportunities: 4,
    cultureFit: 3,
    title: 'High pressure but great career acceleration',
    pros: 'The scale of operations is massive. You take extreme ownership of services, which boosts your career growth very quickly.',
    cons: 'On-call shifts are highly stressful. PIP culture is real, and work-life balance is often sacrificed for deadlines.',
  },
  {
    companySlug: 'amazon',
    role: 'Software Engineer I',
    rating: 4,
    workLifeBalance: 3,
    managementQuality: 4,
    growthOpportunities: 5,
    cultureFit: 4,
    title: 'Brilliant technical learning for freshers',
    pros: 'You learn a ton of system design patterns. The onboarding process is structured and peers are very supportive in teaching you.',
    cons: 'Frugality mindset means office perks are basic. Stock vesting schedule is heavily back-loaded (5/15/40/40).',
  },
  {
    companySlug: 'meta',
    role: 'SDE II',
    rating: 5,
    workLifeBalance: 4,
    managementQuality: 5,
    growthOpportunities: 5,
    cultureFit: 4,
    title: 'Fast moving execution-oriented culture',
    pros: 'Excellent compensation packages, high equity upside. The impact you can make on billions of users is extremely satisfying.',
    cons: 'Move fast culture can lead to tech debt. Stack ranking performance reviews make the environment slightly competitive.',
  },
  {
    companySlug: 'microsoft',
    role: 'SDE II',
    rating: 4,
    workLifeBalance: 4,
    managementQuality: 4,
    growthOpportunities: 4,
    cultureFit: 4,
    title: 'Solid company with great stability',
    pros: 'Very stable job security, good work-life balance. Highly collaborative workspace, remote work options are quite flexible.',
    cons: 'Tech stack varies widely by org. Some teams use older systems, making the learning curve slightly dated.',
  },
  {
    companySlug: 'flipkart',
    role: 'SDE I',
    rating: 4,
    workLifeBalance: 3,
    managementQuality: 4,
    growthOpportunities: 4,
    cultureFit: 4,
    title: 'Best e-commerce learning in India',
    pros: 'Engineering challenges are very similar to Amazon. The scale during Big Billion Days is massive and exciting to handle.',
    cons: 'Work hours can get long during sales events. Promotions are highly dependent on manager support.',
  },
  {
    companySlug: 'meesho',
    role: 'SDE II',
    rating: 4,
    workLifeBalance: 3,
    managementQuality: 4,
    growthOpportunities: 5,
    cultureFit: 4,
    title: 'High ownership and fast execution',
    pros: 'Very smart peer group, high degree of ownership. Flat hierarchy, you can pitch ideas directly to directors.',
    cons: 'Fast-paced growth means processes are still being established. Office building can get quite crowded.',
  },
  {
    companySlug: 'nvidia',
    role: 'Hardware Engineer',
    rating: 5,
    workLifeBalance: 4,
    managementQuality: 5,
    growthOpportunities: 5,
    cultureFit: 5,
    title: 'Semiconductor giant with unbeatable stock performance',
    pros: 'The ESPP and stock grants have made many employees wealthy. Exceptional technological leadership in the AI space.',
    cons: 'High expectations of technical depth. Working across global timezone differences requires late evening syncs.',
  },
  {
    companySlug: 'zepto',
    role: 'SDE II',
    rating: 3,
    workLifeBalance: 2,
    managementQuality: 3,
    growthOpportunities: 5,
    cultureFit: 3,
    title: 'Extremely fast quick commerce hyper-growth',
    pros: 'Learn a lot about logistics and high-speed features. Massive scaling challenges, quick release cycles.',
    cons: 'Work-life balance is almost non-existent. Late-night deployments and weekend escalations are normal.',
  },
  {
    companySlug: 'tcs',
    role: 'Systems Engineer',
    rating: 3,
    workLifeBalance: 5,
    managementQuality: 3,
    growthOpportunities: 2,
    cultureFit: 4,
    title: 'Good job security and relaxed pace',
    pros: 'Excellent job stability, low stress levels. Good policies for leaves and health insurance for family.',
    cons: 'Starting packages are very low. Career growth and technical skills can stagnate if you are on bench.',
  },
  {
    companySlug: 'infosys',
    role: 'Technology Analyst',
    rating: 3,
    workLifeBalance: 4,
    managementQuality: 3,
    growthOpportunities: 2,
    cultureFit: 3,
    title: 'Good starting place but slow pay hikes',
    pros: 'Beautiful campuses (especially Mysore), stable work environments. Good training programs for fresh graduates.',
    cons: 'Annual appraisal increments are low. Heavy reliance on manual timesheets and micro-management in some teams.',
  },
  {
    companySlug: 'wipro',
    role: 'Project Engineer',
    rating: 3,
    workLifeBalance: 4,
    managementQuality: 3,
    growthOpportunities: 2,
    cultureFit: 3,
    title: 'Stable career path with basic learning',
    pros: 'Good work security and brand value. Work hours are mostly fixed (9 to 6) with decent leaves.',
    },
];

const rawInterviewsData = [
  {
    companySlug: 'google',
    role: 'Software Engineer',
    difficulty: 4,
    rounds: 5,
    outcome: 'OFFER',
    experience: 'Great overall experience. The hiring committee took about 2 weeks to give feedback. The focus was heavily on algorithmic coding and system scalability.',
    questions: '1. Given a binary tree, find the maximum path sum.\n2. Design a rate limiter for an API endpoint.\n3. Implement a thread-safe circular buffer.',
  },
  {
    companySlug: 'google',
    role: 'SDE II',
    difficulty: 5,
    rounds: 6,
    outcome: 'REJECT',
    experience: 'Excellent interviews but very tough. Reached the team matching round but ultimately got rejected because of one weak feedback on behavioral/googlyness rounds.',
    questions: '1. Design Google Autocomplete feature.\n2. Word ladder transformation problem.\n3. Detailed system design for real-time multiplayer gaming server.',
  },
  {
    companySlug: 'amazon',
    role: 'SDE II',
    difficulty: 4,
    rounds: 5,
    outcome: 'OFFER',
    experience: 'Process was fast. 1 Online assessment and 4 loop rounds. Prepare Amazon Leadership Principles thoroughly as they carry 50% weight in every round.',
    questions: '1. Design a warehouse management system.\n2. LRU cache implementation.\n3. Describe a time when you disagreed with a manager and how you handled it.',
  },
  {
    companySlug: 'amazon',
    role: 'SDET II',
    difficulty: 3,
    rounds: 4,
    outcome: 'OFFER',
    experience: 'Focused on automation scripting, coding and testing frameworks. Good interviewers, detailed feedback provided.',
    questions: '1. Write an automation script to verify checkout flows.\n2. Find all duplicate elements in an array.\n3. Design a test plan for an elevator system.',
  },
  {
    companySlug: 'meta',
    role: 'SDE II',
    difficulty: 4,
    rounds: 4,
    outcome: 'OFFER',
    experience: 'Very structured process. 1 phone screen (Leetcode Medium/Hard) and 3 onsite rounds (2 coding, 1 system design, 1 behavioral). Speed of coding is crucial.',
    questions: '1. Decode String Leetcode problem.\n2. Design Instagram news feed generation.\n3. Behavioral questions on executing fast and handling tight deadlines.',
  },
  {
    companySlug: 'microsoft',
    role: 'SDE II',
    difficulty: 3,
    rounds: 5,
    outcome: 'OFFER',
    experience: 'Standard interview loops. Focus on clean code, memory efficiency, and object-oriented design patterns.',
    questions: '1. Reverse linked list in groups of K.\n2. Design an online parking lot system.\n3. Implement a trie data structure for auto-suggestions.',
  },
  {
    companySlug: 'flipkart',
    role: 'SDE II',
    difficulty: 4,
    rounds: 4,
    outcome: 'OFFER',
    experience: 'Machine coding round was the first round, where you have to write fully functional, modular code within 2 hours. Next was system design and algorithmic rounds.',
    questions: '1. Machine Coding: Design an in-memory queue system (like Kafka) with pub-sub mechanics.\n2. Standard SQL query optimization problems.\n3. Design a flash sale inventory system.',
  },
  {
    companySlug: 'meesho',
    role: 'SDE II',
    difficulty: 4,
    rounds: 4,
    outcome: 'OFFER',
    experience: 'Very practical rounds. The system design round focused heavily on cost optimization and scaling databases under high load.',
    questions: '1. Design an OTP generation and verification system.\n2. Explain sharding vs partitioning and write SQL joins.\n3. Implement a key-value store database wrapper.',
  },
  {
    companySlug: 'nvidia',
    role: 'Hardware Engineer',
    difficulty: 5,
    rounds: 5,
    outcome: 'OFFER',
    experience: 'Deep dive into computer architecture, Verilog/VHDL, and digital circuit design. The interviewers were principal engineers with immense depth of knowledge.',
    questions: '1. Explain cache coherency protocols (MESI).\n2. Write Verilog code for a FIFO queue with async clocks.\n3. Solve setup and hold time violation timing diagrams.',
  },
  {
    companySlug: 'zepto',
    role: 'SDE III',
    difficulty: 4,
    rounds: 4,
    outcome: 'GHOSTED',
    experience: 'Cleared all rounds. Tech rounds went very well. However, HR ghosted me after salary negotiation. Extremely disappointing HR coordination.',
    questions: '1. Design a real-time order tracking map system for delivery riders.\n2. Solve 3 Leetcode Hard DP/Graph problems.\n3. How to achieve sub-second caching for high traffic home feeds.',
  },
  {
    companySlug: 'tcs',
    role: 'Systems Engineer',
    difficulty: 2,
    rounds: 2,
    outcome: 'OFFER',
    experience: 'Aptitude test followed by a single combined Technical and HR interview. The interview was basic and touched upon basic Java, SQL, and OOPs concepts.',
    questions: '1. What is the difference between abstract class and interface in Java?\n2. Write a SQL query to find the second highest salary.\n3. What are normalization rules in DBMS?',
  },
  {
    companySlug: 'infosys',
    role: 'Technology Analyst',
    difficulty: 2,
    rounds: 3,
    outcome: 'OFFER',
    experience: 'HackWithInfy coding test followed by technical rounds. Simple algorithm questions and resume review.',
    questions: '1. Check if a string is a palindrome.\n2. Explain polymorphism with a code sample.\n3. Describe your final year college project.',
  },
  {
    companySlug: 'wipro',
    role: 'Project Engineer',
    difficulty: 2,
    rounds: 2,
    outcome: 'OFFER',
    experience: 'Elite national talent hunt test followed by standard technical/HR discussions. Very simple programming checks.',
    questions: '1. Write a program to reverse a string.\n2. What is inheritance in C++?\n3. Explain the difference between primary key and foreign key.',
  },
];

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.salary.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.interview.deleteMany({});
  await prisma.communityComment.deleteMany({});
  await prisma.communityPost.deleteMany({});
  await prisma.workplaceScore.deleteMany({});
  await prisma.company.deleteMany({});

  console.log('Cleared database.');

  // Create companies and build map of slug to ID
  const companySlugToIdMap: Record<string, string> = {};

  for (const cData of companiesData) {
    const company = await prisma.company.create({
      data: cData,
    });
    companySlugToIdMap[company.slug] = company.id;
  }

  console.log(`Seeded ${companiesData.length} companies.`);

  // Create salaries
  let salaryCount = 0;
  for (const sData of rawSalariesData) {
    const companyId = companySlugToIdMap[sData.companySlug];
    if (!companyId) {
      console.warn(`Warning: Company slug ${sData.companySlug} not found in map.`);
      continue;
    }

    const totalCompensation = sData.base + sData.bonus + sData.stock;

    await prisma.salary.create({
      data: {
        companyId,
        role: sData.role,
        level: sData.level,
        location: sData.location,
        currency: sData.currency,
        experienceYears: sData.experienceYears,
        baseSalary: sData.base,
        bonus: sData.bonus,
        stock: sData.stock,
        totalCompensation,
        source: Source.CONTRIBUTOR,
        confidenceScore: 0.95,
        isVerified: Math.random() > 0.3,
      },
    });
    salaryCount++;
  }

  console.log(`Seeded ${salaryCount} salary records.`);

  // Create reviews
  let reviewCount = 0;
  for (const rData of rawReviewsData) {
    const companyId = companySlugToIdMap[rData.companySlug];
    if (!companyId) {
      console.warn(`Warning: Company slug ${rData.companySlug} not found for review.`);
      continue;
    }

    await prisma.review.create({
      data: {
        companyId,
        role: rData.role,
        rating: rData.rating,
        workLifeBalance: rData.workLifeBalance,
        managementQuality: rData.managementQuality,
        growthOpportunities: rData.growthOpportunities,
        cultureFit: rData.cultureFit,
        title: rData.title,
        pros: rData.pros,
        cons: rData.cons,
        isAnonymous: true,
      },
    });
    reviewCount++;
  }

  console.log(`Seeded ${reviewCount} review records.`);

  // Create interviews
  let interviewCount = 0;
  for (const iData of rawInterviewsData) {
    const companyId = companySlugToIdMap[iData.companySlug];
    if (!companyId) {
      console.warn(`Warning: Company slug ${iData.companySlug} not found for interview.`);
      continue;
    }

    await prisma.interview.create({
      data: {
        companyId,
        role: iData.role,
        difficulty: iData.difficulty,
        rounds: iData.rounds,
        outcome: iData.outcome,
        experience: iData.experience,
        questions: iData.questions,
        isAnonymous: true,
      },
    });
    interviewCount++;
  }

  console.log(`Seeded ${interviewCount} interview records.`);

  // Create community posts and comments
  let postCount = 0;
  let commentCount = 0;
  const rawCommunityPostsData = [
    {
      companySlug: 'google',
      topic: null,
      title: 'Google L5 Promo Timeline?',
      body: 'How long does it typically take to go from L4 to L5 in Bengaluru? I have been L4 for 2.5 years, strong ratings, but manager keeps saying slots are limited. Should I look to jump?',
      comments: [
        'L4 to L5 is notoriously slow now. Usually takes 3-4 years minimum under standard review guidelines.',
        'Suggest interviewing elsewhere. External hire is the only way to get L5 comp quickly.',
        'Same situation here. 3 years as L4. Just got promoted last cycle, but required leading multiple cross-functional projects.'
      ]
    },
    {
      companySlug: 'amazon',
      topic: null,
      title: 'Worse WLB: AWS vs Retail?',
      body: 'Looking to transfer internally within Amazon India. Is the work-life balance and on-call rotation better in AWS or Retail? Currently in a retail pod and on-call is killer.',
      comments: [
        'AWS is typically worse. Ops load is heavy and page frequency is very high.',
        'Depends entirely on the team, but Retail generally has less high-severity system-down pages than AWS S3/EC2 core infrastructure.'
      ]
    },
    {
      companySlug: null,
      topic: 'layoffs',
      title: 'Tech Hiring Market Outlook 2026',
      body: 'Are we seeing a recovery in SDE-II/SDE-III hiring in Bengaluru? Zepto, Razorpay, Meesho seem to be hiring, but MAANG headcount feels stagnant.',
      comments: [
        'MAANG headcount is definitely frozen or replacement-only. VC-backed startups are hiring but they bargain hard on comp.',
        'Seeing a lot of contract-to-hire positions, but full-time roles with high stock components are scarce.',
        'Zepto is hiring like crazy, but WLB is extremely tough. Be ready for 12hr days.'
      ]
    },
    {
      companySlug: null,
      topic: 'compensation',
      title: 'Meesho SDE-III Compensation Bracket',
      body: 'What is the current standard base salary and equity range for Meesho SDE-III in Bangalore? Got an offer with 45L base + 8L ESOPs per year. Is this inline or low?',
      comments: [
        'That base is solid. Meesho does not have variables, so 45L cash base is clean.',
        'ESOPs value is subjective, but standard cash component is very good. You should accept.',
        'Can confirm 42-48L base is standard for SDE-III at Meesho.'
      ]
    },
    {
      companySlug: null,
      topic: 'interview-prep',
      title: 'Flipkart Machine Coding Round Practice',
      body: 'How do you prepare for Flipkart machine coding rounds? Is it mostly writing design patterns, in-memory queue/parking lot systems? Any tips on language choices?',
      comments: [
        'Use Java or C++ because strict OOP and threading models are easier to represent cleanly.',
        'Focus on concurrency, lock mechanisms, and driver/executor test scripts. Code must run and show results in terminal.',
        'Practice building a fully working system in 90 minutes. Separating entities, services, and interfaces is key.'
      ]
    }
  ];

  for (const pData of rawCommunityPostsData) {
    const companyId = pData.companySlug ? companySlugToIdMap[pData.companySlug] : null;

    const post = await prisma.communityPost.create({
      data: {
        companyId,
        topic: pData.topic,
        title: pData.title,
        body: pData.body,
      },
    });

    for (const commentBody of pData.comments) {
      await prisma.communityComment.create({
        data: {
          postId: post.id,
          body: commentBody,
        },
      });
      commentCount++;
    }
    postCount++;
  }

  console.log(`Seeded ${postCount} community posts with ${commentCount} replies.`);
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
