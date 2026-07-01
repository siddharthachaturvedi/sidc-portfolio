/* ══════════════════════════════════════════════════════════════════
   THE DUAL-INTENT LEDGER — CLIENT-SIDE CORE RUNTIME
   Designed for SIDC.AI // Post-Agentic Systems
   ══════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  /* ══════════════════════════════════════════════════════════════════
     1. MOBILE MENU NAVIGATION
     ══════════════════════════════════════════════════════════════════ */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuPanel = document.getElementById("site-menu-panel");

  if (menuToggle && menuPanel) {
    const getMenuFocusableElements = () =>
      Array.from(
        menuPanel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );

    const setMenuState = (isOpen) => {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuPanel.setAttribute("aria-hidden", String(!isOpen));
      menuPanel.toggleAttribute("inert", !isOpen);
      document.body.classList.toggle("menu-open", isOpen);

      if (isOpen) {
        const focusableElements = getMenuFocusableElements();
        if (focusableElements.length) {
          requestAnimationFrame(() => focusableElements[0].focus());
        }
      }
    };

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

  /* ══════════════════════════════════════════════════════════════════
     2. SILKY SCROLL REVEALS
     ══════════════════════════════════════════════════════════════════ */
  const revealItems = document.querySelectorAll(".reveal");

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
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ══════════════════════════════════════════════════════════════════
     3. INTERACTIVE VALUE FUNCTION SANDBOX (GRAVITY WARP MESH)
     ══════════════════════════════════════════════════════════════════ */
  const canvas = document.getElementById("sandbox-canvas");
  const cardTitle = document.getElementById("pillar-card-title");
  const cardBody = document.getElementById("pillar-card-body");
  const displayCard = document.getElementById("pillar-display-card");

  if (canvas && cardTitle && cardBody) {
    const ctx = canvas.getContext("2d");

    // Resolve palette from CSS tokens once (kept in sync with tokens.css).
    const css = getComputedStyle(document.documentElement);
    const token = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
    const inkColor = token("--ink", "#17201e");
    const accentColor = token("--vermillion", "#a55027");
    const bgColor = token("--surface-slate", "#faf8f5");
    const gridColor = token("--grid-line-strong", "rgba(23, 32, 30, 0.08)");
    
    // Canvas Geometry Configuration
    const vertices = [
      { name: "Resonance", x: 210, y: 60, r: 16, labelY: -26 },
      { name: "Relevance", x: 60, y: 310, r: 16, labelY: 34 },
      { name: "Response", x: 360, y: 310, r: 16, labelY: 34 }
    ];
    
    // Central Equilibrium floating state
    let center = { x: 210, y: 210, r: 12 };
    
    // UI dynamic data mappings
    const pillarData = [
      {
        title: "Resonance <span>/ Voice</span>",
        body: "Makes AI sound like your team — native to your voice, not a generic chatbot."
      },
      {
        title: "Relevance <span>/ Evidence</span>",
        body: "Grounds every answer in verified, proprietary sources — so it cites real evidence instead of making things up."
      },
      {
        title: "Response <span>/ Execution</span>",
        body: "Turns the answer into real next steps inside your workflow — a logged action or a clear summary, not another wall of text."
      }
    ];

    let activePillarIndex = -1;
    let manualPillar = null; // set via the keyboard pillar buttons; pauses auto-select
    let isDragging = false;
    let draggedNode = null;

    const getDistance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    const springUpdate = () => {
      if (!isDragging) {
        const targetX = (vertices[0].x + vertices[1].x + vertices[2].x) / 3;
        const targetY = (vertices[0].y + vertices[1].y + vertices[2].y) / 3;
        
        center.x += (targetX - center.x) * 0.08;
        center.y += (targetY - center.y) * 0.08;
      }
    };

    const updateActivePillar = () => {
      if (manualPillar !== null) return; // a keyboard button selection is held
      let minDist = Infinity;
      let nearestIdx = 0;

      vertices.forEach((v, idx) => {
        const dist = getDistance(center.x, center.y, v.x, v.y);
        if (dist < minDist) {
          minDist = dist;
          nearestIdx = idx;
        }
      });

      if (nearestIdx !== activePillarIndex) {
        activePillarIndex = nearestIdx;
        
        displayCard.style.opacity = "0.3";
        displayCard.style.transform = "translateX(-4px)";
        
        setTimeout(() => {
          cardTitle.innerHTML = pillarData[nearestIdx].title;
          cardBody.innerText = pillarData[nearestIdx].body;
          displayCard.style.opacity = "1";
          displayCard.style.transform = "translateX(0)";
        }, 150);
      }
    };

    // Keyboard-accessible pillar selection (a11y fallback for the pointer-only
    // canvas): the three buttons drive the same descriptive card. A selection is
    // "held" via manualPillar until the user drags the canvas again.
    const pillarButtons = document.querySelectorAll("[data-pillar-btn]");
    const showPillar = (idx) => {
      manualPillar = idx;
      activePillarIndex = idx;
      cardTitle.innerHTML = pillarData[idx].title;
      cardBody.innerText = pillarData[idx].body;
      pillarButtons.forEach((b, i) => b.setAttribute("aria-pressed", String(i === idx)));
    };
    pillarButtons.forEach((btn, i) => {
      btn.addEventListener("click", () => showPillar(i));
      btn.addEventListener("focus", () => showPillar(i));
    });

    // Render Canvas Loop with Gravitational Grid Warp Math
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mathematical gravitational warped grid lines!
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // Draw vertical warped lines
      for (let gridX = 20; gridX < canvas.width; gridX += 20) {
        ctx.beginPath();
        for (let gridY = 0; gridY <= canvas.height; gridY += 10) {
          // Calculate gravitational pull toward Equilibrium center point
          const dx = gridX - center.x;
          const dy = gridY - center.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Lens distortion formulas
          const force = Math.min(1, 1400 / (dist * dist + 100));
          const warpedX = gridX - dx * force * 0.28;
          const warpedY = gridY - dy * force * 0.12;

          if (gridY === 0) {
            ctx.moveTo(warpedX, warpedY);
          } else {
            ctx.lineTo(warpedX, warpedY);
          }
        }
        ctx.stroke();
      }

      // Draw horizontal warped lines
      for (let gridY = 20; gridY < canvas.height; gridY += 20) {
        ctx.beginPath();
        for (let gridX = 0; gridX <= canvas.width; gridX += 10) {
          const dx = gridX - center.x;
          const dy = gridY - center.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const force = Math.min(1, 1400 / (dist * dist + 100));
          const warpedX = gridX - dx * force * 0.12;
          const warpedY = gridY - dy * force * 0.28;

          if (gridX === 0) {
            ctx.moveTo(warpedX, warpedY);
          } else {
            ctx.lineTo(warpedX, warpedY);
          }
        }
        ctx.stroke();
      }

      // Draw outer boundary coordinate triangle
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      ctx.lineTo(vertices[1].x, vertices[1].y);
      ctx.lineTo(vertices[2].x, vertices[2].y);
      ctx.closePath();
      ctx.stroke();

      // Draw dynamic vector connection lines
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      vertices.forEach((v) => {
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw vertices
      vertices.forEach((v, idx) => {
        const isActive = idx === activePillarIndex;
        
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = isActive ? accentColor : inkColor;
        ctx.lineWidth = isActive ? 2.5 : 1.5;
        
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isActive ? accentColor : inkColor;
        ctx.beginPath();
        ctx.arc(v.x, v.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isActive ? accentColor : inkColor;
        ctx.font = `bold 10px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.fillText(v.name.toUpperCase(), v.x, v.y + v.labelY);
      });

      // Draw center equilibrium dot
      ctx.fillStyle = inkColor;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(center.x, center.y, center.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(center.x, center.y, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = () => {
      springUpdate();
      updateActivePillar();
      draw();
      requestAnimationFrame(tick);
    };

    const getMousePos = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
      };
    };

    const getTouchPos = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const touch = evt.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    };

    const handleMouseDown = (x, y) => {
      manualPillar = null; // dragging resumes automatic (proximity) selection
      if (getDistance(x, y, center.x, center.y) < center.r + 10) {
        isDragging = true;
        draggedNode = "center";
        return;
      }
      for (let i = 0; i < vertices.length; i++) {
        if (getDistance(x, y, vertices[i].x, vertices[i].y) < vertices[i].r + 10) {
          isDragging = true;
          draggedNode = i;
          return;
        }
      }
    };

    const handleMouseMove = (x, y) => {
      if (!isDragging) return;
      if (draggedNode === "center") {
        center.x = Math.max(50, Math.min(canvas.width - 50, x));
        center.y = Math.max(50, Math.min(canvas.height - 50, y));
      } else if (typeof draggedNode === "number") {
        const v = vertices[draggedNode];
        v.x = Math.max(20, Math.min(canvas.width - 20, x));
        v.y = Math.max(20, Math.min(canvas.height - 20, y));
      }
    };

    canvas.addEventListener("mousedown", (e) => {
      const pos = getMousePos(e);
      handleMouseDown(pos.x, pos.y);
    });

    canvas.addEventListener("mousemove", (e) => {
      const pos = getMousePos(e);
      handleMouseMove(pos.x, pos.y);
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      draggedNode = null;
    });

    canvas.addEventListener("touchstart", (e) => {
      const pos = getTouchPos(e);
      handleMouseDown(pos.x, pos.y);
      e.preventDefault();
    });

    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const pos = getTouchPos(e);
        handleMouseMove(pos.x, pos.y);
      }
      e.preventDefault();
    });

    canvas.addEventListener("touchend", () => {
      isDragging = false;
      draggedNode = null;
    });

    tick();
  }

});
