import Link from "next/link";

export default function NotFound() {
  return (
    <main className="arch-pattern flex flex-1 items-center justify-center px-5 py-20">
      <div className="max-w-lg rounded-3xl border border-[#e5d7bd] bg-[#fcf9f1] p-8 text-center shadow-xs md:p-12">
        <p className="text-xs font-bold tracking-[0.22em] text-[#80613a]">
          404 · PAGE NOT FOUND
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[#382b20]">
          This page could not be found.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#514334]">
          The page you are looking for may have moved or is not part of the unified
          SSF TKMCE website.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center rounded-full bg-[#382b20] px-6 py-2.5 text-xs font-semibold text-[#fcf9f1] transition hover:bg-[#514334]"
          >
            Return Home
          </Link>
          <Link
            href="/knowledge"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[#c49a45] bg-white px-6 py-2.5 text-xs font-semibold text-[#382b20] transition hover:bg-[#f7f0df]"
          >
            Explore Knowledge Corner
          </Link>
        </div>
      </div>
    </main>
  );
}
