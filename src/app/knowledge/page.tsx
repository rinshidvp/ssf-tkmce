import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { KnowledgeExplorer } from "@/components/knowledge-explorer";
import { knowledgeArticles } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Knowledge Corner",
  description: "Student essays, Darse notes, and reflections across English, Malayalam, and Arabic in one archive.",
};

export default function KnowledgePage() {
  return (
    <main>
      <PageBanner
        eyebrow="READ · REFLECT · SHARE"
        title="The Knowledge Corner"
        description="Student essays, study circle reflections, and cultural notes published together in English, Malayalam, and Arabic inside one archive."
        malayalamLine="അറിവിന്റെ ഇടം — ഇംഗ്ലീഷ്, മലയാളം, അറബി രചനകളുടെ ഏകീകൃത ശേഖരം."
        arabicLine="اقْرَأْ بِاسْمِ رَبِّكَ"
      />

      <section className="mx-auto max-w-7xl px-5 py-14">
        <KnowledgeExplorer articles={knowledgeArticles} />
      </section>
    </main>
  );
}
