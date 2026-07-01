/* ══════════════════════════════════════════════════════════════════
   KINETIC MOTION — pointer-driven flourishes (Washi × Kinetic)
   • Weight-morph on the Fraunces hero title (variable wght axis)
   • Magnetic buttons
   Gated behind prefers-reduced-motion + a fine pointer, so touch devices
   and motion-sensitive users get a calm, static page. Blur-up reveals are
   handled in CSS (.reveal/.is-visible) + the IntersectionObserver in main.js.
   ══════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduceMotion || !finePointer) return;

  document.addEventListener("DOMContentLoaded", () => {
    /* ── Kinetic Fraunces title ─────────────────────────────────────── */
    const title = document.querySelector(".hero__title");
    if (title) {
      // Split into per-character spans while preserving the accent wrapper
      // (Chaturvedi = .hero__title-accent, italic ochre) and the trailing dot.
      const lines = title.innerHTML.trim().split(/<br\s*\/?>/i);
      let html = "";
      lines.forEach((line) => {
        // aria-hidden: the split glyphs are decorative; the H1's aria-label
        // ("Siddhartha Chaturvedi") supplies the accessible name so screen
        // readers don't announce it letter-by-letter.
        html += `<span class="hero__title-line" aria-hidden="true">`;
        const tmp = document.createElement("div");
        tmp.innerHTML = line.trim();
        tmp.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            for (const ch of node.textContent) {
              html += ch.trim() === "" ? " " : `<span class="hero__char">${ch}</span>`;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            html += `<span class="${node.className}">`;
            for (const ch of node.textContent) {
              html += ch.trim() === "" ? " " : `<span class="hero__char">${ch}</span>`;
            }
            html += `</span>`;
          }
        });
        html += `</span>`;
      });
      title.innerHTML = html;

      const chars = Array.from(title.querySelectorAll(".hero__char"));
      let centres = [];

      // Cache each glyph centre so the mousemove handler does zero layout
      // reads. Smoothing is handled by the CSS transition on .hero__char,
      // so no rAF loop is needed (and it works even where rAF is throttled).
      const measure = () => {
        centres = chars.map((c) => {
          const r = c.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
      };
      measure();
      window.addEventListener("resize", measure);
      window.addEventListener("scroll", measure, { passive: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

      const reset = (ch) => {
        if (ch.style.fontWeight) {
          ch.style.fontWeight = "";
          ch.style.transform = "";
        }
      };
      const maxDist = 190;

      window.addEventListener("mousemove", (e) => {
        for (let i = 0; i < chars.length; i++) {
          const c = centres[i];
          if (!c) continue;
          const dx = e.clientX - c.x;
          const dy = e.clientY - c.y;
          const dist = Math.hypot(dx, dy);
          const ch = chars[i];
          if (dist < maxDist) {
            const f = 1 - dist / maxDist;
            ch.style.fontWeight = Math.round(380 + f * 320); // 380 → 700
            const repel = (f * 6) / (dist || 1);
            ch.style.transform = `translate(${-dx * repel}px, ${-dy * repel}px)`;
          } else {
            reset(ch);
          }
        }
      });
      window.addEventListener("mouseleave", () => chars.forEach(reset));
    }

    /* ── Magnetic buttons ───────────────────────────────────────────── */
    const magnets = document.querySelectorAll(".button");
    magnets.forEach((el) => {
      const strength = 0.28;
      const max = 7;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) * strength;
        const my = (e.clientY - (r.top + r.height / 2)) * strength;
        const cx = Math.max(-max, Math.min(max, mx));
        const cy = Math.max(-max, Math.min(max, my));
        el.style.transform = `translate(${cx}px, ${cy}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  });
})();
