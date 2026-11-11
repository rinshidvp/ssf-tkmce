import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { DarseExplorer } from "@/components/darse-explorer";
import { darseSessions } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Darse",
  description: "Weekly campus Darse, classical Arabic kitab study circles, and Malayalam takeaway notes at TKMCE.",
};

export default function DarsePage() {
  return (
    <main>
      <PageBanner
        eyebrow="LEARN · REFLECT · GROW"
        title="Darse & Study Circles"
        description="Weekly gatherings combining classical Arabic text study with thoughtful English dialogue and Malayalam takeaway reflections."
        malayalamLine="അറിവ് ഒരു യാത്രയാണ് — പ്രതിവാര ദർസ് സെഷനുകളും പഠനക്കുറിപ്പുകളും."
        arabicLine="وَقُل رَّبِّ زِدْنِي عِلْمًا"
      />

      <section className="mx-auto max-w-7xl px-5 py-14">
        <DarseExplorer sessions={darseSessions} />
      </section>
    </main>
  );
}
