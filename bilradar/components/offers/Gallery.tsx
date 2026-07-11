"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-[rgb(var(--border))]">
        {list[active] && (
          <Image
            src={list[active]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Vis bilde ${i + 1}`}
              className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? "border-accent" : "border-transparent"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
