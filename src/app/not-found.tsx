import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-extrabold text-[#FF5A5F] tracking-tight">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-[#222222]">Page Not Found</h2>
      <p className="mt-2 text-base text-[#717171] max-w-md">
        Sorry, we couldn&apos;t find the page you are looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/salaries"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[#FF5A5F] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#ff4449]"
        >
          View Salaries
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md border border-[#EBEBEB] bg-white px-6 text-sm font-semibold text-[#484848] transition-colors hover:bg-slate-50"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
