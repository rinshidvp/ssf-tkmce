import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { knowledgeArticles } from "@/data/site-content";

export function generateStaticParams() {
  return knowledgeArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = knowledgeArticles.find((a) => a.slug === slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.englishContext ?? article.excerpt,
  };
}

export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = knowledgeArticles.find((a) => a.slug === slug);

  if (!article) notFound();

  const isArabic = article.language === "Arabic";
  const isMalayalam = article.language === "Malayalam";
  const related = knowledgeArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 md:py-16">
      <Link
        href="/knowledge"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#80613a] hover:text-[#382b20]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Knowledge Corner
      </Link>

      <article className="mt-8 rounded-3xl border border-[#e5d7bd] bg-white p-7 shadow-sm md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efe5cf] pb-5 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-[#382b20] px-3 py-1 font-semibold text-[#f7f0df]">
              {article.language}
            </span>
            <span className="text-[#80613a]">{article.publishedLabel}</span>
          </div>
          <span className="text-[#80613a]">{article.readTime}</span>
        </div>

        <div
          lang={isArabic ? "ar" : isMalayalam ? "ml" : "en"}
          dir={isArabic ? "rtl" : "ltr"}
          className="mt-8"
        >
          <p
            className={`text-xs font-semibold text-[#9a7439] ${
              isArabic ? "font-arabic" : isMalayalam ? "font-malayalam" : ""
            }`}
          >
            {article.category}
          </p>

          <h1
            className={`mt-3 text-[#382b20] ${
              isArabic
                ? "font-arabic text-3xl font-bold md:text-4xl"
                : isMalayalam
                  ? "font-malayalam text-2xl font-bold leading-snug md:text-3xl"
                  : "font-serif text-4xl leading-tight md:text-5xl"
            }`}
          >
            {article.title}
          </h1>

          <p
            className={`mt-4 text-base leading-8 text-[#6f6253] ${
              isArabic ? "font-arabic text-lg" : isMalayalam ? "font-malayalam" : ""
            }`}
          >
            {article.subtitle}
          </p>

          {article.featuredQuote && (
            <blockquote
              className={`my-8 rounded-2xl border border-[#e5d7bd] bg-[#fcf9f1] p-6 text-[#382b20] ${
                isArabic
                  ? "font-arabic text-xl"
                  : isMalayalam
                    ? "font-malayalam text-base"
                    : "font-serif text-2xl italic"
              }`}
            >
              {article.featuredQuote}
            </blockquote>
          )}

          <div className="mt-6 space-y-5">
            {article.body.map((paragraph, index) => (
              <p
                key={index}
                className={`text-base leading-8 text-[#292723] ${
                  isArabic
                    ? "font-arabic text-lg leading-loose"
                    : isMalayalam
                      ? "font-malayalam"
                      : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {article.englishContext && (
          <div className="mt-10 rounded-2xl border border-[#e5d7bd] bg-[#f7f0df]/70 p-5 text-xs leading-6 text-[#514334]">
            <span className="font-bold tracking-[0.16em] text-[#80613a]">
              ENGLISH SUMMARY ·{" "}
            </span>
            {article.englishContext}
          </div>
        )}
      </article>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-[#382b20]">Continue Reading</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/knowledge/${item.slug}`}
              className="rounded-2xl border border-[#e5d7bd] bg-white p-5 transition hover:border-[#c49a45]"
            >
              <span className="text-[11px] font-semibold text-[#9a7439]">
                {item.language} · {item.readTime}
              </span>
              <p
                lang={item.language === "Arabic" ? "ar" : item.language === "Malayalam" ? "ml" : "en"}
                dir={item.language === "Arabic" ? "rtl" : "ltr"}
                className={`mt-2 text-lg text-[#382b20] ${
                  item.language === "Arabic"
                    ? "font-arabic font-bold"
                    : item.language === "Malayalam"
                      ? "font-malayalam font-semibold"
                      : "font-serif text-2xl"
                }`}
              >
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
