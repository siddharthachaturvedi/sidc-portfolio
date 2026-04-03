document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuPanel = document.getElementById("site-menu-panel");
  const printLinks = document.querySelectorAll("[data-print-link]");
  const revealItems = document.querySelectorAll(".reveal");

  if (menuToggle && menuPanel) {
    const getMenuFocusableElements = () =>
      Array.from(
        menuPanel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );

    const setMenuState = (isOpen) => {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close site menu" : "Open site menu");
      menuPanel.setAttribute("aria-hidden", String(!isOpen));
      document.body.classList.toggle("menu-open", isOpen);

      if (isOpen) {
        const focusableElements = getMenuFocusableElements();
        if (focusableElements.length) {
          requestAnimationFrame(() => focusableElements[0].focus());
        }
      }
    };

    setMenuState(false);

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    menuPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 980) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      const menuIsOpen = menuToggle.getAttribute("aria-expanded") === "true";

      if (event.key === "Escape" && menuIsOpen) {
        setMenuState(false);
        menuToggle.focus();
      }

      if (event.key === "Tab" && menuIsOpen) {
        const focusableElements = getMenuFocusableElements();
        if (!focusableElements.length) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  printLinks.forEach((link) => {
    const printUrl = link.getAttribute("data-print-url");

    if (printUrl) {
      link.setAttribute("href", `${printUrl}?autoprint=1`);
    }
  });

  const pillars = document.querySelectorAll(".vf-pillar");
  const vertexGroups = document.querySelectorAll("[data-pillar]");

  if (pillars.length && vertexGroups.length) {
    const highlight = (index) => {
      pillars.forEach((p, i) => p.classList.toggle("is-active", i === index));
      vertexGroups.forEach((v) =>
        v.classList.toggle("is-active", v.getAttribute("data-pillar") === String(index))
      );
    };

    const clearHighlight = () => {
      pillars.forEach((p) => p.classList.remove("is-active"));
      vertexGroups.forEach((v) => v.classList.remove("is-active"));
    };

    vertexGroups.forEach((el) => {
      const idx = parseInt(el.getAttribute("data-pillar"), 10);
      el.addEventListener("mouseenter", () => highlight(idx));
      el.addEventListener("mouseleave", clearHighlight);
      el.addEventListener("focus", () => highlight(idx));
      el.addEventListener("blur", clearHighlight);
    });

    pillars.forEach((el, idx) => {
      el.addEventListener("mouseenter", () => highlight(idx));
      el.addEventListener("mouseleave", clearHighlight);
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

});
