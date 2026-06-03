# TalentDash — Tech Compensation Intelligence Platform

TalentDash is a career intelligence platform focused on structured tech compensation data. It converts crowdsourced and scraped salary data into decision-ready insights for tech careers in India and worldwide.

---

## 1. Project Goal & Design Philosophy

TalentDash is built as a programmatic SEO platform. It is designed to scale organic search traffic by dynamically generating highly structured company profile pages, side-by-side comparison tables, and dynamic salary filters.

- **Data-First**: Visual layouts maximize information density while remaining readable, clean, and professional.
- **Airbnb UI Discipline**: Strict spacing, typography, and contrast rules.
- **Light-Mode Only**: Avoids dark mode, glassmorphism, or heavy gradients. Design relies on raw data tables, border cards, and minimal accent highlights.

---

## 2. Non-Negotiable Technology Stack

- **Frontend**: Next.js 15+ App Router, TypeScript (Strict Mode), Tailwind CSS v4, React Server Components (RSC)
- **Backend Services**: Next.js Route Handlers, service-oriented business logic layers
- **ORM / Database**: Prisma ORM v7, Neon Serverless PostgreSQL (with connection pooling)

---

## 3. Design System Color Tokens

All design tokens are defined in `src/app/globals.css` using Tailwind v4 theme configurations:

| Token | Hex Code | Usage |
|---|---|---|
| `--color-primary` | `#FF5A5F` | Buttons, CTAs, active highlights, negative deltas |
| `--color-deep-text` | `#222222` | H1 headings, company titles, major metrics |
| `--color-body-text` | `#484848` | Body paragraphs, standard text |
| `--color-muted-text` | `#717171` | Helper labels, small timestamps, empty states |
| `--color-surface` | `#FFFFFF` | Cards, tables, popup modals |
| `--color-background-app` | `#F7F7F7` | Core application background |
| `--color-border-custom` | `#EBEBEB` | Dividers, input outlines, table rows |
| `--color-success` | `#008A05` | Growth indicators, positive delta win badges |
| `--color-warning` | `#FFB400` | Incomplete or unverified records |
| `--color-error` | `#D93025` | Form errors, negative deltas |
| `--color-hover-surface` | `#F2F2F2` | Table row hover highlight |

---

## 4. Platform Structure (8 Interconnected Product Areas)

The platform is designed to scale to 8 core modules:

1. **Salaries** (✅ In MVP): Dynamic search, sorting, and pagination list at `/salaries`.
2. **Companies** (✅ In MVP): SEO-optimized company profiles at `/companies/[slug]`.
3. **Compare** (✅ In MVP): Interactive side-by-side analysis at `/compare`.
4. **Reviews** (Future Stub): Anonymous employer reviews (Stub created).
5. **Interviews** (Future Stub): Interview rounds, prep questions, and outcomes (Stub created).
6. **Tools** (Future Stub): Career calculators and cost of living maps (Stub created).
7. **Community** (Future Stub): Negotiation forums and offer evaluations (Stub created).
8. **Workplace Index** (Future Stub): Performance ratings across key workplace markers (Stub created).

---

## 5. Core Data Contract (Single Source of Truth)

Every layer of the application (Prisma schema, TypeScript interfaces, validation middleware) enforces this strict schema contract:

```typescript
type SalaryRecord = {
  id: string;
  companyId: string;
  role: string;              // Stored exactly as submitted (no normalization)
  level: Level;              // Standardized level enum
  location: string;          // City only (no state or country, e.g. "Bengaluru")
  currency: Currency;        // INR | USD | GBP | EUR
  experienceYears: number;   // 1 to 50
  baseSalary: bigint;        // Stored as BigInt to support large currency numbers
  bonus: bigint;             // Stored as BigInt, default 0
  stock: bigint;             // Stored as BigInt, default 0
  totalCompensation: bigint; // Base + Bonus + Stock (Always server-computed!)
  source: Source;            // CONTRIBUTOR | SCRAPED | AI_INFERRED
  confidenceScore: number;   // 0.0 to 1.0 (verified contributor = 0.95)
  isVerified: boolean;       // Default false
  submittedAt: Date;         // Auto-generated timestamp
};
```

---

## 6. Rendering & Caching Strategy

To balance fast loading speeds (LCP < 2s) and database query costs, the platform utilizes Next.js App Router caching layers:

- **Homepage (`/`)**: Incremental Static Regeneration (ISR) with `revalidate = 3600` (1 hour) to keep employer counters fresh.
- **Salaries Page (`/salaries`)**: Dynamic server-side rendering combined with client-side query string synchronization to support infinite filter variations.
- **Company Profile Page (`/companies/[slug]`)**: Static Site Generation (SSG) using `generateStaticParams()` to pre-render the top 12 seeded companies. Fallback is set to `dynamicParams = true` to statically compile new companies upon their first search hit.
- **Comparison Page (`/compare`)**: ISR with `revalidate = 86400` (24 hours) for the selection shell, fetching the comparison result dynamically from the database when both parameters are chosen.

---

## 7. Pagination Rationale

We implement server-side cursor-like limit/offset pagination on `/api/salaries` (configured in `src/lib/config.ts` to default to 25 and cap at 100).
- **Why?** Programmatic SEO pages require fast load times and crawlable paging links. Client-side pagination would require downloading all records on mount, crushing Lighthouse performance.
- **SEO Crawling**: Page queries are synced to URL parameters (`?page=2`), allowing search engine crawlers to discover paginated records organically.

---

## 8. setup and Local Development

### Prerequisites
- Node.js 18+
- Neon PostgreSQL Database

### Installation & Run

1. Clone and install dependencies:
   ```bash
   npm install
   ```
2. Populate your `.env` file in the root using Neon credentials:
   ```env
   DATABASE_URL="postgresql://[user]:[pass]@[endpoint]-pooler.region.aws.neon.tech/[dbname]?sslmode=require"
   DIRECT_URL="postgresql://[user]:[pass]@[endpoint].region.aws.neon.tech/[dbname]?sslmode=require"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```
3. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
4. Push database tables and run the seed script:
   ```bash
   npm run db:push
   ```
   *Note: This command will automatically run the typescript seeding command (`npx tsx prisma/seed.ts`) to populate 12 companies and 63 realistic salary entries.*
5. Run the dev server:
   ```bash
   npm run dev
   ```

---

## 9. Scraper & Ingestion Pipeline

An ingestion endpoint is available at `POST /api/ingest-salary`. It executes the following strict pipeline:
1. **Validation**: Checks for mandatory fields, types, level enums, city-only locations (no commas), positive values, and experience (integer 1-50).
2. **Normalization**: Automatically normalizes company names (removes suffixes like "Ltd" or "Inc" and converts to lowercase) and generates SEO-friendly slugs.
3. **Total Compensation**: Server-side arithmetic adds base, bonus, and stock. Any client-provided TC is discarded.
4. **Deduplication**: Rejects submissions with matching company, role, level, location, and TC (within a ±10% margin) submitted within the last 48 hours.

An example scraper script is available at `scripts/scraper/example-scraper.ts`.

---

## 10. Side-by-Side Comparison Logic

When comparing two salary records at `/compare`, the engine performs the following actions:
- **Currency Conversion**: It converts the base, bonus, stock, and total compensation of Record 2 into the currency of Record 1 using exchange rates defined in `src/lib/config.ts`.
- **Deltas**: It subtracts the converted Record 2 values from Record 1 values to compute accurate differences.
- **Winners**: It declares the winner for each compensation category based on the highest converted value, utilizing a margin of tolerance (epsilon) to avoid float discrepancies.

---

## 11. "With Another Day" (Future Scope)

If given another day of development, the following features would be implemented:
- **Reviews & Interviews Integration**: Connect the Prisma stub schemas to interactive submission forms on the frontend.
- **Secure Ingestion Tokens**: Add JWT-based API key authentication to `POST /api/ingest-salary` to verify crawlers and prevent spam.
- **Salary Calculator Tools**: Build calculators for standardizing stock grants (double trigger RSUs, options models) and cost-of-living adjustments across locations.
- **Search Auto-Suggestions**: Add an Elasticsearch/Postgres full-text search bar that provides instant company auto-completions as users type.

---

## 12. Intentionally Cut

To meet the 72-hour trial deadline and focus on programmatic SEO efficiency:
- **Authentication**: No sign-in/sign-up forms. Submissions are anonymous but validation filters and deduplication parameters are aggressive to guarantee data cleanliness.
- **Complex Charts**: Avoided heavy charting libraries (e.g. Chart.js, Recharts) to maximize page loading speeds. Level distributions are represented using pure Tailwind CSS utility bars.
- **Dark Mode**: Omitted prefers-color-scheme styles to enforce a clean, single visual palette.
