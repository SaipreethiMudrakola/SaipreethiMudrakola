(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Year */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Mobile nav */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  const closeNav = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* Experience expand / collapse */
  const toggleBtn = $("#toggleExperience");
  const hiddenJobs = $$(".exp-card.is-collapsed");

  if (toggleBtn) {
    let expanded = false;

    toggleBtn.addEventListener("click", () => {
      expanded = !expanded;
      hiddenJobs.forEach((card) => {
        if (expanded) {
          card.hidden = false;
          requestAnimationFrame(() => card.classList.add("is-visible"));
        } else {
          card.hidden = true;
          card.classList.remove("is-visible");
        }
      });
      toggleBtn.setAttribute("aria-expanded", String(expanded));
      toggleBtn.textContent = expanded ? "Show less experience" : "Show more experience";
      if (!expanded) {
        $("#experience")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* Contact form — mailto fallback (no backend required for GitHub Pages) */
  const form = $("#contactForm");
  const formNote = $("#formNote");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      formNote?.classList.remove("is-error");

      const name = $("#name")?.value.trim() || "";
      const email = $("#email")?.value.trim() || "";
      const subject = $("#subject")?.value.trim() || "";
      const message = $("#message")?.value.trim() || "";

      if (!name || !email || !subject || !message) {
        if (formNote) {
          formNote.textContent = "Please fill in all fields.";
          formNote.classList.add("is-error");
        }
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        if (formNote) {
          formNote.textContent = "Please enter a valid email address.";
          formNote.classList.add("is-error");
        }
        return;
      }

      // UPDATE: replace with real inbox before hosting
      const to = "saipreethi.0731@gmail.com";
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formNote) {
        formNote.textContent = "Opening your email client…";
      }

      window.location.href = mailto;
      form.reset();
    });
  }

  /* Smooth active section highlight (optional nicety) */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-menu a[href^='#']");

  if (sections.length && "IntersectionObserver" in window) {
    const map = new Map(navLinks.map((a) => [a.getAttribute("href")?.slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((l) => l.classList.remove("is-active"));
          map.get(id)?.classList.add("is-active");
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* Reveal on scroll */
  const revealEls = $$(".skill-card, .project-card, .exp-card, .about-card, .contact-form, .contact-method");
  revealEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const rio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => rio.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* Header shadow when scrolled */
  const header = $(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.style.paddingTop = window.scrollY > 12 ? "0.55rem" : "0.85rem";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
