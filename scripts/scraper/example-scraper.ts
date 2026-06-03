/**
 * Example Ingestion Scraper Template
 * 
 * Demonstrates feeding raw scraped data into the TalentDash ingestion API.
 * Handles company name cleaning, location checks, and outputs success or rejection logs.
 * 
 * To run:
 * npx tsx scripts/scraper/example-scraper.ts
 */

const LOCAL_INGEST_URL = 'http://localhost:3000/api/ingest-salary';

const scrapedData = [
  {
    company: 'Tata Consultancy Services Ltd.',
    role: 'SDE II',
    level: 'SDE_II',
    location: 'Bengaluru',
    currency: 'INR',
    experienceYears: 5,
    baseSalary: 950000,
    bonus: 50000,
    stock: 0,
  },
  {
    company: 'Google Inc.',
    role: 'Software Engineer',
    level: 'L3',
    location: 'Hyderabad',
    currency: 'INR',
    experienceYears: 2,
    baseSalary: 1900000,
    bonus: 200000,
    stock: 500000,
  },
  {
    company: 'NVIDIA Corp.',
    role: 'Silicon Engineer',
    level: 'IC4',
    location: 'Pune',
    currency: 'INR',
    experienceYears: 4,
    baseSalary: 2800000,
    bonus: 300000,
    stock: 450000,
  },
  // Invalid item that will be rejected (negative base salary)
  {
    company: 'Meesho Ltd.',
    role: 'Developer',
    level: 'SDE_I',
    location: 'Bengaluru',
    currency: 'INR',
    experienceYears: 1,
    baseSalary: -500000,
    bonus: 0,
    stock: 0,
  },
  // Invalid item that will be rejected (non city-only location)
  {
    company: 'Meesho Ltd.',
    role: 'Developer',
    level: 'SDE_I',
    location: 'Bengaluru, India',
    currency: 'INR',
    experienceYears: 1,
    baseSalary: 1200000,
    bonus: 0,
    stock: 0,
  },
];

async function runScraper() {
  console.log('Starting ingestion scraper pipeline...');
  console.log(`Target endpoint: ${LOCAL_INGEST_URL}`);
  console.log('Make sure the Next.js dev server is running on port 3000 (npm run dev) first.\n');

  for (const record of scrapedData) {
    console.log(`--------------------------------------------------`);
    console.log(`Sending item: "${record.company}" • Role: "${record.role}"...`);

    try {
      const response = await fetch(LOCAL_INGEST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...record,
          source: 'SCRAPED',
          confidenceScore: 0.75, // Default scraper confidence score
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ SUCCESS: Ingested record for ${result.companyName} with ID: ${result.id}`);
        console.log(`   Base: ${result.baseSalary} | Bonus: ${result.bonus} | Stock: ${result.stock}`);
        console.log(`   Total Compensation (Server-computed): ${result.totalCompensation}`);
      } else {
        console.log(`❌ REJECTED: Status code ${response.status}`);
        console.log(`   Validation errors:`, result.errors);
      }
    } catch (error) {
      const err = error as Error;
      console.error(`💥 CONNECTION ERROR: Could not connect to API server. is it running? Error:`, err.message);
    }
  }

  console.log(`--------------------------------------------------`);
  console.log('Scraper run finished.');
}

runScraper();
