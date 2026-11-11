"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { MemoryItem } from "@/data/site-content";

const albums = [
  "All",
  "Campus Gathering",
  "Darse & Study",
  "Arts & Literary",
  "Ramadan & Service",
] as const;

const paletteStyles: Record<MemoryItem["palette"], string> = {
  brown: "from-[#faf3e3] to-[#efe3c8]",
  bronze: "from-[#f7f0df] to-[#e9d8b6]",
  terracotta: "from-[#f8efe7] to-[#ecd9c6]",
};

export function MemoriesGallery({ items }: { items: MemoryItem[] }) {
  const [selectedAlbum, setSelectedAlbum] = useState<(typeof albums)[number]>("All");
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeMemory) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMemory(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMemory]);

  const filtered =
    selectedAlbum === "All"
      ? items
      : items.filter((item) => item.album === selectedAlbum);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {albums.map((album) => {
          const active = selectedAlbum === album;
          return (
            <button
              key={album}
              type="button"
              onClick={() => setSelectedAlbum(album)}
              className={`min-h-[44px] rounded-full px-5 py-2.5 text-xs font-semibold transition ${
                active
                  ? "bg-[#382b20] text-[#fcf9f1]"
                  : "border border-[#e5d7bd] bg-white text-[#514334] hover:border-[#c49a45]"
              }`}
            >
              {album}
            </button>
          );
        })}
      </div>

      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveMemory(item)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5d7bd] bg-white text-left transition hover:border-[#c49a45] hover:shadow-sm"
          >
            <div
              className={`arch-pattern relative flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-b p-5 text-center text-[#382b20] ${paletteStyles[item.palette]}`}
            >
              <div className="arch-card-top flex h-full w-full flex-col items-center justify-center border border-[#c49a45]/60 bg-[#fcf9f1]/60 px-4">
                <span aria-hidden="true" className="text-4xl text-[#80613a] transition-transform group-hover:scale-110">
                  {item.motifSymbol}
                </span>
                <span className="mt-3 text-xs font-bold tracking-[0.18em] text-[#80613a]">
                  {item.season.toUpperCase()}
                </span>
                <span className="mt-1.5 text-xs text-[#6f6253]">
                  Photo slot · Click to preview
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-bold tracking-[0.16em] text-[#80613a]">
                {item.album.toUpperCase()}
              </span>
              <h2 className="mt-2 font-serif text-2xl text-[#382b20]">
                {item.title}
              </h2>
              <p className="font-malayalam mt-1 text-xs text-[#80613a]">
                {item.malayalamCaption}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#514334]">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {activeMemory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeMemory.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#201811]/60 p-4 backdrop-blur-sm"
          onClick={() => setActiveMemory(null)}
        >
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#c49a45] bg-[#fcf9f1] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close memory preview"
              onClick={() => setActiveMemory(null)}
              className="absolute top-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#382b20] text-[#fcf9f1]"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className={`arch-pattern flex h-52 flex-col items-center justify-center bg-gradient-to-b text-[#382b20] ${paletteStyles[activeMemory.palette]}`}
            >
              <div className="text-5xl text-[#c49a45]">{activeMemory.motifSymbol}</div>
              <p className="mt-3 text-xs font-bold tracking-[0.2em] text-[#80613a]">
                {activeMemory.season.toUpperCase()}
              </p>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-xs font-bold tracking-[0.18em] text-[#80613a]">
                {activeMemory.album.toUpperCase()}
              </p>
              <h3 className="mt-2 font-serif text-3xl text-[#382b20]">
                {activeMemory.title}
              </h3>
              <p className="font-malayalam mt-1.5 text-sm text-[#80613a]">
                {activeMemory.malayalamCaption}
              </p>
              <p className="mt-4 text-sm leading-7 text-[#514334]">
                {activeMemory.description}
              </p>
              <p className="mt-5 rounded-xl border border-[#e5d7bd] bg-[#f7f0df]/70 px-4 py-3 text-xs text-[#80613a]">
                Ready for authentic campus photographs uploaded with student permission.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
