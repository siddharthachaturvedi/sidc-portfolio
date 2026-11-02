/* ══════════════════════════════════════════════════════════════════
   HOMEPAGE — scrollspy for the identity rail + contact form handling
   ══════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  /* ── Scrollspy: highlight the rail link for the section in view and
     slide the nav marker next to it. Sections without a nav link (hero,
     contact) clear the highlight. ── */
  const links = Array.from(document.querySelectorAll(".rail nav a"));
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const marker = document.querySelector(".nav-marker");
  let current = null;

  const setCurrent = (link) => {
    current = link;
    links.forEach((a) => a.removeAttribute("aria-current"));
    if (link) link.setAttribute("aria-current", "true");
    if (!marker) return;
    marker.classList.toggle("is-active", Boolean(link));
    if (link) {
      marker.style.transform = `translateY(${link.offsetTop}px)`;
      marker.style.height = `${link.offsetHeight}px`;
    }
  };

  if (links.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setCurrent(byId.get(entry.target.id) || null);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );

    document.querySelectorAll("main > section").forEach((section) => observer.observe(section));

    window.addEventListener("resize", () => setCurrent(current));
    if (document.fonts) document.fonts.ready.then(() => setCurrent(current));
  }

  /* ── Contact form ──
     No backend: open the visitor's own email app with a formatted message to
     data-mailto. Their address comes from their mail app, so we only ask for a name. */
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");

  const buildMailto = (data) => {
    const to = form.dataset.mailto;
    const name = data.get("name").trim();
    const topic = data.get("topic");
    // RFC 6068: line breaks in a mailto body are CRLF
    const message = data.get("message").trim().replace(/\r?\n/g, "\r\n");
    const subject = `[sidc.ai] ${topic}, from ${name}`;
    const body = [
      "Hi Sid,",
      "",
      message,
      "",
      "Best,",
      name,
      "",
      "--",
      `Topic: ${topic}`,
      "Sent from the contact form on sidc.ai",
    ].join("\r\n");
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = "Please add your name and a short message.";
      const invalid = form.querySelector(":invalid");
      if (invalid) invalid.focus();
      return;
    }

    window.location.href = buildMailto(new FormData(form));
    status.textContent = `Your email app should open with this ready to send. If it doesn't, write to ${form.dataset.mailto}.`;
  });
})();
