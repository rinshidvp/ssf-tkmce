import Link from "next/link";
import { navItems, siteBrand } from "@/data/site-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e5d7bd] bg-[#f4ebda] text-[#382b20]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.35fr_1fr_1fr] md:py-14">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#c49a45] bg-[#fcf9f1] font-serif text-xs font-bold tracking-wider text-[#382b20]">
              {siteBrand.shortName}
            </div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
              {siteBrand.name}
            </p>
          </div>
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic mt-4 text-2xl text-[#382b20]"
          >
            {siteBrand.arabicFooterVerse}
          </p>
          <p className="mt-1 text-sm italic text-[#6f6253]">
            {siteBrand.arabicFooterTranslation}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#514334]">
            A unified campus space bringing together English inquiry, Malayalam heritage,
            and classical Arabic wisdom at {siteBrand.campus}.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
            EXPLORE
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-0.5 text-sm md:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[40px] items-center text-[#514334] transition hover:text-[#80613a]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/join"
                className="inline-flex min-h-[40px] items-center font-semibold text-[#6f532f] transition hover:text-[#382b20]"
              >
                Join Community
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
            CAMPUS &amp; LANGUAGES
          </p>
          <p className="mt-4 text-sm font-semibold text-[#382b20]">
            {siteBrand.campus}
          </p>
          <p className="mt-1 text-sm text-[#6f6253]">{siteBrand.location}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-[#514334]">
            <Link
              href="/knowledge"
              className="inline-flex min-h-[40px] items-center rounded-full border border-[#d6c29d] bg-[#fcf9f1] px-4 py-2 transition hover:border-[#c49a45]"
            >
              English
            </Link>
            <Link
              href="/knowledge"
              className="inline-flex min-h-[40px] items-center rounded-full border border-[#d6c29d] bg-[#fcf9f1] px-4 py-2 transition hover:border-[#c49a45]"
            >
              Malayalam Archive
            </Link>
            <Link
              href="/knowledge"
              className="inline-flex min-h-[40px] items-center rounded-full border border-[#d6c29d] bg-[#fcf9f1] px-4 py-2 transition hover:border-[#c49a45]"
            >
              Arabic Archive
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e5d7bd] bg-[#efe4ce]/65 px-5 py-4 text-center text-xs text-[#6f6253]">
        {siteBrand.name} · {siteBrand.taglineEnglish}
      </div>
    </footer>
  );
}
