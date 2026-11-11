import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import {
  activities,
  corePillars,
  darseSessions,
  knowledgeArticles,
  memories,
  siteBrand,
  trilingualHeritage,
} from "@/data/site-content";

export default function HomePage() {
  const featuredDarse = darseSessions[0];
  const featuredActivities = activities.slice(0, 3);
  const englishEssays = knowledgeArticles.filter((a) => a.language === "English");
  const arabicSpotlight = knowledgeArticles.find((a) => a.language === "Arabic");
  const featuredMemories = memories.slice(0, 3);

  return (
    <main>
      {/* Light Architectural Hero */}
      <section className="arch-pattern border-b border-[#e5d7bd] bg-gradient-to-b from-[#faf3e3] via-[#fcf9f1] to-[#f7f0df] text-[#382b20]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
              {siteBrand.name} · {siteBrand.campus.toUpperCase()}
            </p>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.1] text-[#382b20] sm:text-5xl lg:text-6xl">
              Faith that connects. Knowledge that inspires.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#514334] sm:text-lg sm:leading-8">
              A student community at TKM College of Engineering built on sincerity,
              brotherhood, service, and learning—where campus dialogue in English meets
              Kerala’s heritage and classical Arabic wisdom.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/activities"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#382b20] px-6 py-3 text-sm font-semibold text-[#fcf9f1] transition hover:bg-[#514334]"
              >
                Explore Activities <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/darse"
                className="inline-flex items-center justify-center rounded-full border border-[#c49a45] bg-[#fcf9f1] px-6 py-3 text-sm font-semibold text-[#382b20] transition hover:bg-[#f4ebda]"
              >
                Weekly Darse
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-[#dfd1b7] px-6 py-3 text-sm font-medium text-[#514334] transition hover:border-[#c49a45] hover:text-[#382b20]"
              >
                Our Story
              </Link>
            </div>
          </div>

          <div className="arch-frame mx-auto aspect-[4/5] w-full max-w-[320px] bg-gradient-to-b from-[#ffffff] via-[#fcf9f1] to-[#f2e6ce] p-5 shadow-md sm:max-w-sm">
            <div className="arch-card-top flex h-full flex-col items-center justify-between border border-[#d6b66f]/70 bg-[#fcf9f1]/80 px-6 py-8 text-center">
              <p lang="ar" dir="rtl" className="font-arabic text-base text-[#80613a]">
                {siteBrand.taglineArabic}
              </p>

              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c49a45] bg-[#f7f0df] font-serif text-xl font-bold text-[#382b20] shadow-xs">
                  {siteBrand.shortName}
                </div>
                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic mt-5 text-3xl leading-relaxed text-[#382b20]"
                >
                  {siteBrand.arabicHeroMotto}
                </p>
                <p className="mt-2 text-sm italic text-[#6f6253]">
                  “{siteBrand.arabicHeroTranslation}”
                </p>
              </div>

              <div className="w-full border-t border-[#e5d7bd] pt-4">
                <p className="font-serif text-xl font-semibold tracking-[0.12em] text-[#382b20]">
                  {siteBrand.name}
                </p>
                <p className="mt-1 text-xs font-medium tracking-[0.08em] text-[#80613a]">
                  {siteBrand.taglineEnglish}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e5d7bd] bg-[#f7f0df]/75 px-5 py-3 text-center text-xs font-medium tracking-[0.18em] text-[#6f532f]">
          {siteBrand.campus.toUpperCase()} · {siteBrand.location.toUpperCase()}
        </div>
      </section>

      {/* Three Living Traditions Strip */}
      <section className="border-b border-[#e5d7bd] bg-[#fcf9f1]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
                ONE CAMPUS · THREE LIVING TRADITIONS
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#382b20] md:text-4xl">
                English, Malayalam &amp; Arabic in one home
              </h2>
            </div>
            <Link
              href="/knowledge"
              className="inline-flex min-h-[44px] items-center gap-1 py-2 text-sm font-semibold text-[#80613a] hover:text-[#382b20]"
            >
              Browse Knowledge Corner <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {trilingualHeritage.map((item) => (
              <div
                key={item.script}
                className="flex flex-col rounded-2xl border border-[#e5d7bd] bg-[#faf4e8]/60 p-6"
              >
                <p className="font-serif text-2xl font-semibold text-[#382b20]">
                  {item.script}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-[#80613a]">
                  {item.nativeLabel}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#514334]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="mx-auto max-w-7xl px-5 py-6 md:py-10">
        {corePillars.map((pillar) => (
          <div
            key={pillar.number}
            className="grid gap-4 border-b border-[#e5d7bd] py-10 md:grid-cols-[96px_1fr_1.1fr] md:items-start md:gap-8 md:py-12"
          >
            <div className="font-serif text-4xl leading-none text-[#c49a45]">
              {pillar.number}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#80613a]">
                {pillar.eyebrow}
              </p>
              <h2 className="font-serif text-3xl leading-tight text-[#382b20]">
                {pillar.title}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#514334]">
              {pillar.body}
            </p>
          </div>
        ))}
      </section>

      {/* Weekly Darse Spotlight (Light Warm Palette) */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="overflow-hidden rounded-3xl border border-[#e5d7bd] bg-white shadow-xs">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="min-w-0 p-6 sm:p-8 md:p-10">
              <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
                WEEKLY DARSE SPOTLIGHT
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#382b20] md:text-4xl">
                {featuredDarse.title}
              </h2>

              <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-[#6f6253]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#c49a45]" />
                  {featuredDarse.schedule}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#c49a45]" />
                  {featuredDarse.venue}
                </span>
              </div>

              <p className="mt-5 text-base leading-7 text-[#514334]">
                {featuredDarse.englishOverview}
              </p>

              <Link
                href="/darse"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#382b20] px-6 py-3 text-xs font-semibold text-[#fcf9f1] transition hover:bg-[#514334]"
              >
                Explore Darse Schedule &amp; Notes <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="arch-pattern flex min-w-0 flex-col justify-center border-t border-[#e5d7bd] bg-[#f7f0df] p-6 text-[#382b20] sm:p-8 md:border-t-0 md:border-l md:p-10">
              <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
                CLASSICAL TEXT REFLECTION
              </p>
              <p
                lang="ar"
                dir="rtl"
                className="font-arabic mt-4 text-3xl leading-relaxed text-[#382b20]"
              >
                {featuredDarse.arabicQuote}
              </p>
              <p className="mt-2 text-sm italic text-[#80613a]">
                {featuredDarse.transliteration}
              </p>
              <p className="mt-4 border-t border-[#dfd1b7] pt-4 text-sm leading-7 text-[#514334]">
                “{featuredDarse.quoteMeaning}”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Preview */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
              A COMMUNITY IN ACTION
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#382b20] md:text-4xl">
              Campus Programmes &amp; Initiatives
            </h2>
          </div>
          <Link
            href="/activities"
            className="inline-flex min-h-[44px] items-center gap-1 py-2 text-sm font-semibold text-[#80613a] hover:text-[#382b20]"
          >
            View all activities <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {featuredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e5d7bd] bg-white p-6"
            >
              <div>
                <span className="text-xs font-bold tracking-[0.16em] text-[#80613a]">
                  {activity.category.toUpperCase()}
                </span>
                <h3 className="mt-2 font-serif text-2xl text-[#382b20]">
                  {activity.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#514334]">
                  {activity.summary}
                </p>
              </div>
              <p className="mt-6 border-t border-[#efe5cf] pt-4 text-xs font-semibold text-[#80613a]">
                {activity.schedule}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge Corner Preview (English Cards Linking to Full EN/ML/AR Archive) */}
      <section className="border-y border-[#e5d7bd] bg-[#faf4e8]/70">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
                READ · REFLECT · SHARE
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#382b20] md:text-4xl">
                The Knowledge Corner
              </h2>
              <p className="mt-2 text-sm text-[#514334]">
                Featured campus essays—browse the full archive in English, Malayalam, and Arabic.
              </p>
            </div>
            <Link
              href="/knowledge"
              className="inline-flex min-h-[44px] items-center gap-1 py-2 text-sm font-semibold text-[#80613a] hover:text-[#382b20]"
            >
              Explore full archive <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {englishEssays.map((article) => (
              <Link
                key={article.slug}
                href={`/knowledge/${article.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-[#e5d7bd] bg-[#fcf9f1] p-6 transition hover:border-[#c49a45] hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-[#e8d8b4]/75 px-3 py-1 font-semibold text-[#382b20]">
                      {article.language}
                    </span>
                    <span className="text-[#80613a]">{article.readTime}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl leading-snug text-[#382b20] group-hover:text-[#80613a]">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#514334]">
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[#efe5cf] pt-4 text-xs font-semibold text-[#80613a]">
                  <span>{article.publishedLabel}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            ))}

            {arabicSpotlight && (
              <Link
                href="/knowledge"
                className="group flex flex-col justify-between rounded-2xl border border-[#e5d7bd] bg-[#fcf9f1] p-6 transition hover:border-[#c49a45] hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-[#e8d8b4]/75 px-3 py-1 font-semibold text-[#382b20]">
                      Multilingual Archive
                    </span>
                    <span className="text-[#80613a]">EN · ML · AR</span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl leading-snug text-[#382b20] group-hover:text-[#80613a]">
                    Arabic &amp; Malayalam Editions in Knowledge Corner
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#514334]">
                    {arabicSpotlight.englishContext}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[#efe5cf] pt-4 text-xs font-semibold text-[#80613a]">
                  <span>Open all 6 readings</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Memories Preview */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
              THE PHOTO JOURNAL
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#382b20] md:text-4xl">
              Moments That Become Memories
            </h2>
          </div>
          <Link
            href="/memories"
            className="inline-flex min-h-[44px] items-center gap-1 py-2 text-sm font-semibold text-[#80613a] hover:text-[#382b20]"
          >
            Open full archive <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {featuredMemories.map((memory) => (
            <Link
              key={memory.id}
              href="/memories"
              className="group flex flex-col justify-between rounded-2xl border border-[#e5d7bd] bg-white p-6 transition hover:border-[#c49a45]"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#80613a]">
                  <span className="font-bold tracking-[0.16em]">
                    {memory.album.toUpperCase()}
                  </span>
                  <span aria-hidden="true" className="text-xl text-[#80613a]">{memory.motifSymbol}</span>
                </div>
                <h3 className="mt-4 font-serif text-2xl text-[#382b20] group-hover:text-[#80613a]">
                  {memory.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#514334]">
                  {memory.description}
                </p>
              </div>
              <p className="mt-5 border-t border-[#efe5cf] pt-3 text-xs font-medium text-[#80613a]">
                {memory.season}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="arch-pattern border-t border-[#e5d7bd] bg-[#faf4e8] px-5 py-14 text-center md:py-16">
        <p className="text-xs font-bold tracking-[0.22em] text-[#80613a]">
          {siteBrand.name}
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl text-[#382b20] sm:text-4xl md:text-5xl">
          There is a place for you here.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#514334]">
          Whether you are stepping into TKMCE as a fresher or looking for thoughtful
          company, weekly Darse, and cultural expression—join our gatherings.
        </p>
        <div className="mt-7 flex justify-center">
          <Link
            href="/join"
            className="inline-flex items-center justify-center rounded-full bg-[#382b20] px-7 py-3 text-sm font-semibold text-[#fcf9f1] transition hover:bg-[#514334]"
          >
            Connect With Us
          </Link>
        </div>
      </section>
    </main>
  );
}
