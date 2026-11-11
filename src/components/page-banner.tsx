interface PageBannerProps {
  eyebrow: string;
  title: string;
  description: string;
  malayalamLine?: string;
  arabicLine?: string;
}

export function PageBanner({
  eyebrow,
  title,
  description,
  malayalamLine,
  arabicLine,
}: PageBannerProps) {
  return (
    <section className="arch-pattern border-b border-[#e5d7bd] bg-gradient-to-b from-[#faf4e6] to-[#f7f0df] text-[#382b20]">
      <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
            {eyebrow}
          </p>
          {arabicLine && (
            <p lang="ar" dir="rtl" className="font-arabic text-xl text-[#80613a]">
              {arabicLine}
            </p>
          )}
        </div>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-[#382b20] md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#514334]">
          {description}
        </p>
        {malayalamLine && (
          <p className="font-malayalam mt-3 max-w-2xl text-sm font-medium text-[#80613a]">
            {malayalamLine}
          </p>
        )}
      </div>
    </section>
  );
}
