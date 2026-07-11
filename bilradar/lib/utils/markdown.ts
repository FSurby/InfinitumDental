/**
 * Minimal, trygg markdown-renderer for artikkelinnhold.
 * Escaper all HTML først, og støtter deretter et lite sett med syntaks:
 * overskrifter (##, ###), fet (**tekst**), kursiv (*tekst*),
 * lenker [tekst](url), punktlister (-), nummererte lister (1.),
 * sitat (>) og avsnitt. Bevisst enkel – ingen ekstern avhengighet.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text: string): string {
  let t = escapeHtml(text);
  // Lenker: [tekst](https://...) – kun http(s) tillates.
  t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-2">$1</a>',
  );
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return t;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let list: "ul" | "ol" | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      html.push(`<p class="leading-relaxed text-muted">${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (list) {
      html.push(`</${list}>`);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) {
      flushPara();
      closeList();
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara();
      closeList();
      const level = h[1].length;
      const sizes: Record<number, string> = {
        1: "text-3xl font-bold mt-8 mb-3",
        2: "text-2xl font-bold mt-8 mb-3",
        3: "text-xl font-semibold mt-6 mb-2",
        4: "text-lg font-semibold mt-4 mb-2",
      };
      html.push(
        `<h${level} class="${sizes[level]} text-[rgb(var(--text))]">${inline(
          h[2],
        )}</h${level}>`,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushPara();
      closeList();
      html.push(
        `<blockquote class="border-l-4 border-accent pl-4 italic text-muted">${inline(
          line.replace(/^>\s?/, ""),
        )}</blockquote>`,
      );
      continue;
    }

    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const wanted = ul ? "ul" : "ol";
      if (list !== wanted) {
        closeList();
        list = wanted;
        html.push(
          `<${wanted} class="ml-5 list-${
            ul ? "disc" : "decimal"
          } space-y-1 text-muted">`,
        );
      }
      html.push(`<li>${inline((ul ?? ol)![1])}</li>`);
      continue;
    }

    closeList();
    para.push(line.trim());
  }

  flushPara();
  closeList();
  return html.join("\n");
}
