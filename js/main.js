document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuPanel = document.getElementById("site-menu-panel");
  const printLinks = document.querySelectorAll("[data-print-link]");
  const revealItems = document.querySelectorAll(".reveal");
  const valueButtons = Array.from(document.querySelectorAll("[data-vf-target]"));
  const valuePanels = Array.from(document.querySelectorAll("[data-vf-panel]"));

  if (menuToggle && menuPanel) {
    const setMenuState = (isOpen) => {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close site menu" : "Open site menu");
      menuPanel.setAttribute("aria-hidden", String(!isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    };

    setMenuState(false);

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    menuPanel.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 980) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuState(false);
        menuToggle.focus();
      }
    });
  }

  printLinks.forEach((link) => {
    const printUrl = link.getAttribute("data-print-url");

    if (printUrl) {
      link.setAttribute("href", `${printUrl}?autoprint=1`);
    }
  });

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

  if (valueButtons.length && valuePanels.length) {
    const activateValuePanel = (targetName) => {
      valuePanels.forEach((panel) => {
        const isActive = panel.getAttribute("data-vf-panel") === targetName;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });

      valueButtons.forEach((button) => {
        const isActive = button.getAttribute("data-vf-target") === targetName;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    };

    activateValuePanel("equilibrium");

    valueButtons.forEach((button, index) => {
      const activateCurrent = () => activateValuePanel(button.getAttribute("data-vf-target"));

      button.addEventListener("click", activateCurrent);
      button.addEventListener("mouseenter", activateCurrent);
      button.addEventListener("focus", activateCurrent);

      button.addEventListener("keydown", (event) => {
        let nextIndex = null;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % valueButtons.length;
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (index - 1 + valueButtons.length) % valueButtons.length;
        }

        if (event.key === "Home") {
          nextIndex = 0;
        }

        if (event.key === "End") {
          nextIndex = valueButtons.length - 1;
        }

        if (nextIndex !== null) {
          event.preventDefault();
          valueButtons[nextIndex].focus();
          activateValuePanel(valueButtons[nextIndex].getAttribute("data-vf-target"));
        }
      });
    });
  }
});
