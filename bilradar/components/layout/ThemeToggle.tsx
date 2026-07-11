"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Bytt til lyst tema" : "Bytt til mørkt tema"}
      className="btn-ghost !min-h-0 h-11 w-11 !px-0"
    >
      {/* Sol / måne */}
      <span aria-hidden className="text-lg">
        {dark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
