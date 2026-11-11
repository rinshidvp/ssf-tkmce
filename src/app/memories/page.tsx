import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { MemoriesGallery } from "@/components/memories-gallery";
import { memories } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Memories",
  description: "Visual journal of SSF TKMCE gatherings, Sahityotsav moments, Ramadan evenings, and campus life.",
};

export default function MemoriesPage() {
  return (
    <main>
      <PageBanner
        eyebrow="THE PHOTO JOURNAL"
        title="Moments That Become Memories"
        description="A curated campus archive of evening Darse circles, Ramadan Iftar gatherings, freshers’ welcomes, and Sahityotsav stages."
        malayalamLine="ഓർമ്മകളാകുന്ന നിമിഷങ്ങൾ — നമ്മുടെ ക്യാമ്പസ് സംഗമങ്ങളുടെ ശേഖരം."
        arabicLine="ذِكْرَيَاتُ الْأُخُوَّةِ"
      />

      <section className="mx-auto max-w-7xl px-5 py-14">
        <MemoriesGallery items={memories} />
      </section>
    </main>
  );
}
