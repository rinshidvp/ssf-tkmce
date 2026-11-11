import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { campusWings, corePillars, siteBrand, trilingualHeritage } from "@/data/site-content";

export const metadata: Metadata = {
  title: "About",
  description: "Our story, campus mission, and stewardship wings at TKM College of Engineering.",
};

export default function AboutPage() {
  return (
    <main>
      <PageBanner
        eyebrow="WHO WE ARE · ABOUT SSF TKMCE"
        title="More than an organisation. A campus home."
        description="A shared space at TKM College of Engineering for students to grow in faith, deepen intellectual clarity, support peers, and build lasting friendships."
        malayalamLine="ഒരു സംഘടനയിലുപരി — അറിവും സ്നേഹവും പങ്കിടുന്നൊരു കൂട്ടായ്മ."
        arabicLine="بِسْمِ اللَّهِ نَبْدَأُ"
      />

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
              OUR CAMPUS IDENTITY
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[#382b20] md:text-4xl">
              Guided by faith, grounded in {siteBrand.location}
            </h2>
            <p className="mt-5 text-base leading-7 text-[#514334]">
              University years shape not only technical expertise, but character, friendships,
              and moral direction. At {siteBrand.campus}, SSF TKMCE brings students together
              across departments and semesters around regular study circles, literature,
              cultural expression, and mutual care.
            </p>
            <p className="mt-4 text-base leading-7 text-[#514334]">
              Rather than splitting our heritage into disconnected language silos, this
              website reflects how our campus community actually lives: communicating in
              clear English while honouring our Malayalam roots and classical Arabic learning.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5d7bd] bg-[#f7f0df]/70 p-6 md:p-8">
            <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
              THREE VOICES IN ONE SPACE
            </p>
            <div className="mt-5 space-y-5">
              {trilingualHeritage.map((item) => (
                <div key={item.script} className="border-b border-[#e5d7bd] pb-4 last:border-b-0 last:pb-0">
                  <p className="font-serif text-xl font-semibold text-[#382b20]">
                    {item.script}{" "}
                    <span className="text-xs font-normal text-[#80613a]">
                      — {item.nativeLabel}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#514334]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5d7bd] bg-white/70">
        <div className="mx-auto max-w-7xl px-5 py-12">
          {corePillars.map((pillar) => (
            <div
              key={pillar.number}
              className="grid gap-5 border-b border-[#e5d7bd] py-10 last:border-b-0 md:grid-cols-[90px_1fr_1.1fr] md:items-start"
            >
              <div className="font-serif text-3xl text-[#c49a45]">{pillar.number}</div>
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#80613a]">
                  {pillar.eyebrow}
                </p>
                <h3 className="font-serif text-2xl text-[#382b20] md:text-3xl">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-base leading-7 text-[#514334]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
              HOW WE ORGANIZE
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#382b20] md:text-4xl">
              Campus Stewardship Wings
            </h2>
          </div>
          <Link
            href="/join"
            className="inline-flex min-h-[44px] items-center rounded-full bg-[#382b20] px-6 py-3 text-xs font-semibold text-[#fcf9f1] transition hover:bg-[#514334]"
          >
            Volunteer With a Wing
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {campusWings.map((wing) => (
            <div
              key={wing.number}
              className="rounded-2xl border border-[#e5d7bd] bg-white p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-serif text-2xl font-semibold text-[#80613a]">{wing.number}</span>
                <span lang="ar" dir="rtl" className="font-arabic text-base text-[#80613a]">
                  {wing.arabicName}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-2xl text-[#382b20]">
                {wing.name}
              </h3>
              <p className="font-malayalam mt-1 text-xs font-medium text-[#6f532f]">
                {wing.malayalamName}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#6f6253]">{wing.focus}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
