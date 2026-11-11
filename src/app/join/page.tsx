import type { Metadata } from "next";
import { MapPin, Clock, MessageSquare } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { JoinForm } from "@/components/join-form";
import { siteBrand } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Join",
  description: "Connect with SSF TKMCE for Thursday Darse, campus mentorship, Sahityotsav, and student community initiatives.",
};

export default function JoinPage() {
  return (
    <main>
      <PageBanner
        eyebrow="CONNECT WITH US"
        title="There is a place for you here."
        description="Whether you want to attend Thursday Darse, contribute writing in English, Malayalam, or Arabic, or volunteer on campus, reach out below."
        malayalamLine="ഇവിടെ നിങ്ങൾക്കും ഒരിടമുണ്ട് — പഠിക്കാം, പങ്കെടുക്കാം, ഒരുമിച്ച് വളരാം."
        arabicLine="أَهْلًا وَسَهْلًا بِكُمْ"
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e5d7bd] bg-[#f7f0df]/70 p-6">
            <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
              CAMPUS PRESENCE
            </p>
            <h2 className="mt-2 font-serif text-2xl text-[#382b20]">
              {siteBrand.name}
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-[#514334]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c49a45]" />
                <span>
                  {siteBrand.campus}
                  <br />
                  <span className="text-xs text-[#80613a]">{siteBrand.location}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#c49a45]" />
                <span>
                  Weekly Darse: Thursdays after Maghrib
                  <br />
                  <span className="text-xs text-[#80613a]">
                    Open to all students across departments
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#c49a45]" />
                <span>
                  Trilingual Submissions Welcome
                  <br />
                  <span className="text-xs text-[#80613a]">
                    Share essays or poetry in English, Malayalam, or Arabic for Knowledge Corner.
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <JoinForm />
      </section>
    </main>
  );
}
