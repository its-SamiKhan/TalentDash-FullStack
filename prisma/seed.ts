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

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.salary.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.interview.deleteMany({});
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
  let count = 0;
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
    count++;
  }

  console.log(`Seeded ${count} salary records.`);
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
