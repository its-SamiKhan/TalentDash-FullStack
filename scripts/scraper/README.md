# Ingestion Scraper Pipeline Foundation

This folder contains a template for the scraper ingestion pipeline. It demonstrates how scrapers fetch, validate, normalize, and feed salary data into the TalentDash platform.

## Architecture Flow

```
Raw Scraped Data → Normalization (Company Name Suffixes, Location Cities) → JSON Validation → POST Ingestion API Endpoint → Deduplication → Database Commit
```

## How to Run

1. Make sure your local or production database is connected.
2. In your terminal, run the following command to execute the template:
   ```bash
   npx tsx scripts/scraper/example-scraper.ts
   ```

## Key Guidelines for New Scrapers
- **Company Normalization**: Clean company names by removing suffixes (e.g. "ltd", "inc") and mapping abbreviations (e.g. "tcs" for "tata consultancy services").
- **City-Only Locations**: Reject full address formats and states. Only submit city names (e.g. "Bengaluru").
- **Experience Years**: Integer ranges should be converted to their midpoints (e.g. "5-8" → 6).
- **Security / Token (Future)**: The POST endpoint `/api/ingest-salary` should be auth-gated for scrapers in production.
