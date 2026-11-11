import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, CheckCircle2, MapPin } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { activities } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Activities",
  description: "Weekly study circles, Sahityotsav literary arts, Ramadan gatherings, and student welfare at TKMCE.",
};

export default function ActivitiesPage() {
  return (
    <main>
      <PageBanner
        eyebrow="GATHER · SERVE · PARTICIPATE"
        title="Campus Programmes & Initiatives"
        description="From Thursday Darse evenings and annual Sahityotsav literary stages to peer mentorship and Ramadan Iftar nights."
        malayalamLine="പ്രവർത്തനങ്ങളിലൂടെ വളരുന്ന വിദ്യാർത്ഥി കൂട്ടായ്മ."
        arabicLine="وَاعْتَصِمُوا بِحَبْلِ اللَّهِ"
      />

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {activities.map((activity) => (
            <article
              key={activity.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e5d7bd] bg-white p-6 shadow-sm md:p-8"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[#f7f0df] px-3 py-1 text-xs font-bold tracking-[0.16em] text-[#80613a]">
                    {activity.category.toUpperCase()}
                  </span>
                </div>

                <h2 className="mt-4 font-serif text-3xl text-[#382b20]">
                  {activity.title}
                </h2>
                <p className="font-malayalam mt-1 text-sm text-[#80613a]">
                  {activity.malayalamSubtitle}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#6f6253]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#c49a45]" />
                    {activity.schedule}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#c49a45]" />
                    {activity.location}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#514334]">
                  {activity.summary}
                </p>

                <ul className="mt-5 space-y-2 border-t border-[#efe5cf] pt-4 text-xs text-[#6f6253]">
                  {activity.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c49a45]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#e5d7bd] bg-[#f7f0df]/70 p-8 text-center">
          <h3 className="font-serif text-3xl text-[#382b20]">
            Want to help organize an upcoming initiative?
          </h3>
          <p className="mt-2 text-sm text-[#6f6253]">
            Every department and batch brings fresh ideas to campus life.
          </p>
          <Link
            href="/join"
            className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-[#382b20] px-6 py-3 text-xs font-semibold text-[#fcf9f1] transition hover:bg-[#514334]"
          >
            Reach Out to Join
          </Link>
        </div>
      </section>
    </main>
  );
}
