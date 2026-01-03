// GSAP animations
window.addEventListener("load", () => {
  // ✅ Initialize ScrollSmoother first
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,      // higher = smoother
    effects: true,    // allow parallax & ScrollTrigger effects
    normalizeScroll: true
  });

  // ✅ Main hero timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-sub",
      start: "top 100%",
      end: "bottom 50%",
      toggleActions: "play none none reverse",
    }
  });

  // Step 1 — Navbar slides in
  tl.from(".navbar", {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  });

  // Step 2 — Headline words appear one by one
  tl.fromTo(".word",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.5
    },
    "-=0.2"
  );

  // Step 3 — Subtitle fades in
  tl.to(".hero-sub", {
    opacity: 1,
    y: -10,
    duration: 1,
    ease: "power1.out"
  }, "+=0.3");

  // Step 4 — Language loop (only if element exists)
  const emotionWord = document.querySelector("#emotion-word");
  if (emotionWord) {
    tl.add(() => {
      const words = [
        "Emotion!",
        "भावना!",      // Hindi
        "অনুভূতি!",    // Bengali
        "వికారం!",     // Malayalam
        "உணர்ச்சி!",    // Tamil
        "భావన!",      // Telugu
        "جذبات",
        "ਭਾਵਨਾ",
        "લાગણી"
      ];

      let index = 0;

      // timeline that loops forever
      const wordTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.2
      });

      wordTl
        .to(emotionWord, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: "power1.in",
          onComplete: () => {
            index = (index + 1) % words.length;
            emotionWord.textContent = words[index];
          }
        })
        .to(emotionWord, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power1.out"
        });
    });
  }

  // ✅ Scroll-triggered section titles
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: "top 90%" },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  });

  // ✅ Scroll-triggered items (cards, projects, forms, steps)
  // Added .plan-card, .step, .contact-form to the list
  gsap.utils.toArray(".service, .project, .contact-form, .plan-card, .step").forEach((item) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: "top 85%" },
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  // ✅ Work Page: Search & Filter Logic
  const searchInput = document.getElementById("work-search");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workItems = document.querySelectorAll(".project");

  if (searchInput && workItems.length > 0) {

    // Function to filter items
    const filterItems = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-filter");

      workItems.forEach(item => {
        const title = item.querySelector("h3").textContent.toLowerCase();
        const desc = item.querySelector("p").textContent.toLowerCase();
        const meta = item.querySelector(".meta-tag") ? item.querySelector(".meta-tag").textContent.toLowerCase() : "";
        const language = item.getAttribute("data-language");

        // Check text match
        const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm) || meta.includes(searchTerm);

        // Check category match
        const matchesFilter = activeFilter === "all" || language === activeFilter;

        if (matchesSearch && matchesFilter) {
          gsap.to(item, { autoAlpha: 1, display: "flex", duration: 0.4 });
        } else {
          gsap.to(item, { autoAlpha: 0, display: "none", duration: 0.4 });
        }
      });

      // Refresh ScrollTrigger after filtering (wait for animation)
      setTimeout(() => ScrollTrigger.refresh(), 500);
    };

    // Search Input Listener
    searchInput.addEventListener("input", filterItems);

    // Filter Button Listeners
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove("active"));
        // Add active to clicked
        btn.classList.add("active");
        // Filter
        filterItems();
      });
    });
  }

  // ✅ Accordion Functionality for Services Page
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const content = accordionItem.querySelector('.accordion-content');
        const isActive = header.classList.contains('active');

        // Close all other accordions (optional - comment out if you want multiple open)
        accordionHeaders.forEach(otherHeader => {
          if (otherHeader !== header) {
            otherHeader.classList.remove('active');
            otherHeader.parentElement.querySelector('.accordion-content').classList.remove('active');
          }
        });

        // Toggle current accordion
        if (isActive) {
          header.classList.remove('active');
          content.classList.remove('active');
        } else {
          header.classList.add('active');
          content.classList.add('active');
        }

        // Refresh ScrollTrigger after accordion animation
        setTimeout(() => ScrollTrigger.refresh(), 450);
      });
    });
  }

});
