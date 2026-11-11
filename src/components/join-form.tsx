"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

const interestOptions = [
  "Weekly Darse & Study Circle",
  "Sahityotsav & Literary Arts",
  "Knowledge Corner Writing (EN / ML / AR)",
  "Campus Welfare & Community Iftar",
  "Media, Design & Photography",
];

export function JoinForm() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [contact, setContact] = useState("");
  const [interest, setInterest] = useState(interestOptions[0]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#c49a45] bg-[#f7f0df] p-8 text-[#382b20]">
        <div className="flex items-center gap-3 text-[#80613a]">
          <CheckCircle2 className="h-6 w-6" />
          <span className="text-xs font-bold tracking-[0.2em]">INTEREST RECORDED</span>
        </div>
        <h3 className="mt-4 font-serif text-3xl">
          Marhaban, {name}!
        </h3>
        <p className="font-malayalam mt-2 text-sm text-[#80613a]">
          സ്നേഹപൂർവ്വം സ്വാഗതം · {interest}
        </p>
        <p className="mt-4 text-sm leading-7 text-[#514334]">
          Thank you for reaching out to SSF TKMCE. Your interest details have been prepared
          locally in this starter preview. To connect this form live for your unit, wire a
          Supabase table or unit contact channel in production.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setName("");
            setDepartment("");
            setContact("");
            setNote("");
          }}
          className="mt-6 rounded-full border border-[#382b20] px-5 py-2 text-xs font-semibold text-[#382b20] transition hover:bg-[#382b20] hover:text-[#f7f0df]"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#e5d7bd] bg-white/80 p-6 shadow-sm md:p-8"
    >
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-[#80613a]">
          CONNECT WITH THE CAMPUS UNIT
        </p>
        <h2 className="mt-2 font-serif text-3xl text-[#382b20]">
          Join a Gathering or Contribute
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-[#514334]">Full Name *</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-1.5 w-full rounded-xl border border-[#dfd1b7] bg-[#fcf9f1] px-4 py-2.5 text-sm text-[#292723] outline-none focus:border-[#c49a45]"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-[#514334]">
            Department &amp; Semester
          </span>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. CSE S4 / Mech S2"
            className="mt-1.5 w-full rounded-xl border border-[#dfd1b7] bg-[#fcf9f1] px-4 py-2.5 text-sm text-[#292723] outline-none focus:border-[#c49a45]"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-[#514334]">
            Phone / Email *
          </span>
          <input
            type="text"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="WhatsApp number or email"
            className="mt-1.5 w-full rounded-xl border border-[#dfd1b7] bg-[#fcf9f1] px-4 py-2.5 text-sm text-[#292723] outline-none focus:border-[#c49a45]"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-[#514334]">
            Area of Interest
          </span>
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#dfd1b7] bg-[#fcf9f1] py-2.5 pr-8 pl-4 text-sm text-[#292723] outline-none focus:border-[#c49a45]"
          >
            {interestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold text-[#514334]">
          Message or Question
        </span>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ask about Thursday Darse, hostel mentorship, Sahityotsav, or contributing articles in English, Malayalam, or Arabic..."
          className="mt-1.5 w-full rounded-xl border border-[#dfd1b7] bg-[#fcf9f1] px-4 py-2.5 text-sm text-[#292723] outline-none focus:border-[#c49a45]"
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-[#382b20] px-6 py-3 text-sm font-semibold text-[#f7f0df] transition hover:bg-[#514334] sm:w-auto"
      >
        Send Interest Note
      </button>
    </form>
  );
}
