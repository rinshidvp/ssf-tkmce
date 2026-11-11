"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ArticleLanguage, KnowledgeArticle } from "@/data/site-content";

const languageFilters: readonly ("All" | ArticleLanguage)[] = [
  "All",
  "English",
  "Malayalam",
  "Arabic",
];

const languageBadgeLabel: Record<ArticleLanguage, string> = {
  English: "English",
  Malayalam: "മലയാളം · Malayalam",
  Arabic: "العربية · Arabic",
};

export function KnowledgeExplorer({
  articles,
}: {
  articles: KnowledgeArticle[];
}) {
  const [selectedLang, setSelectedLang] = useState<"All" | ArticleLanguage>("All");

  const filtered =
    selectedLang === "All"
      ? articles
      : articles.filter((article) => article.language === selectedLang);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {languageFilters.map((lang) => {
            const active = selectedLang === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLang(lang)}
                className={`min-h-[44px] rounded-full px-5 py-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-[#382b20] text-[#fcf9f1]"
                    : "border border-[#e5d7bd] bg-white text-[#514334] hover:border-[#c49a45]"
                }`}
              >
                {lang === "All" ? "All Languages (EN · ML · AR)" : languageBadgeLabel[lang]}
              </button>
            );
          })}
        </div>
        <p className="text-xs font-medium text-[#80613a]">
          Showing {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="grid items-stretch gap-6 md:grid-cols-2">
        {filtered.map((article) => {
          const isArabic = article.language === "Arabic";
          const isMalayalam = article.language === "Malayalam";

          return (
            <Link
              key={article.slug}
              href={`/knowledge/${article.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-[#e5d7bd] bg-white p-6 transition hover:border-[#c49a45] hover:shadow-sm md:p-7"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[#f7f0df] px-3 py-1 text-xs font-semibold text-[#6f532f]">
                    {languageBadgeLabel[article.language]}
                  </span>
                  <span className="text-xs text-[#80613a]">
                    {article.readTime}
                  </span>
                </div>

                <div
                  lang={isArabic ? "ar" : isMalayalam ? "ml" : "en"}
                  dir={isArabic ? "rtl" : "ltr"}
                  className="mt-5"
                >
                  <p
                    className={`text-xs font-semibold text-[#80613a] ${
                      isArabic ? "font-arabic text-base" : isMalayalam ? "font-malayalam" : ""
                    }`}
                  >
                    {article.category}
                  </p>
                  <h2
                    className={`mt-2 text-[#382b20] transition group-hover:text-[#80613a] ${
                      isArabic
                        ? "font-arabic text-3xl font-bold"
                        : isMalayalam
                          ? "font-malayalam text-xl font-bold leading-snug"
                          : "font-serif text-3xl leading-tight"
                    }`}
                  >
                    {article.title}
                  </h2>
                  <p
                    className={`mt-3 leading-7 text-[#514334] ${
                      isArabic
                        ? "font-arabic text-xl"
                        : isMalayalam
                          ? "font-malayalam text-sm"
                          : "text-sm"
                    }`}
                  >
                    {article.excerpt}
                  </p>
                </div>

                {article.englishContext && (
                  <p className="mt-4 border-t border-[#efe5cf] pt-3 text-xs leading-6 text-[#6f6253]">
                    <span className="font-semibold text-[#382b20]">Context: </span>
                    {article.englishContext}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#efe5cf] pt-4 text-xs font-semibold text-[#382b20]">
                <span>{article.publishedLabel}</span>
                <span className="inline-flex items-center gap-1 text-[#80613a] group-hover:text-[#382b20]">
                  Read piece <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
