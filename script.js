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
      start: "top 80%",
      end: "bottom 50%",        // fixed 'buttom' ➜ 'bottom'
      toggleActions: "play none none reverse",
      // markers: true,          // turn on if you want to debug
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
  // (from below and fade in)
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

  // Step 4 — After hero timeline finishes, start language loop
  tl.add(() => {
    const words = [
    "Emotion!",
    "भावना!",      // Hindi (Bhāvnā - Feeling/Sentiment)
    "অনুভূতি!",    // Bengali (Anubhūti - Feeling/Perception)
    "విകാരം!",     // Malayalam (Vikāram - Emotion/Feeling)
    "உணர்ச்சி!",    // Tamil (Uṇarcci - Feeling/Emotion)
    "భావన!"      // Telugu (Bhāvana - Sentiment/Idea)
];

    let index = 0;
    const el = document.querySelector("#emotion-word");

    if (!el) return;

    // timeline that loops forever
    const wordTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.2 // pause between language changes
    });

    wordTl
      .to(el, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power1.in",
        onComplete: () => {
          // change the text when it's invisible
          index = (index + 1) % words.length;
          el.textContent = words[index];
        }
      })
      .to(el, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.out"
      });
  });

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

  // ✅ Scroll-triggered cards (services + projects)
  gsap.utils.toArray(".service, .project").forEach((item) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: "top 85%" },
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  });
});
