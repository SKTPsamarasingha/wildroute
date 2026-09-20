import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateNavbar = (root: HTMLElement) => {
  const wrapper = root.querySelector<HTMLElement>(".nav-isolated-wrapper");
  if (!wrapper || prefersReducedMotion()) return;

  const brand = wrapper.querySelector<HTMLElement>("[data-nav-brand]");
  const items = wrapper.querySelectorAll<HTMLElement>(".nav-item-discrete");
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (brand)
    timeline.fromTo(
      brand,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.65 },
    );
  items.forEach((item, index) => {
    timeline.fromTo(
      item,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.45 },
      0.08 + index * 0.06,
    );
  });

  return () => timeline.kill();
};

const animateHeroCinematicCamera = (root: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const cleanups: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>(".hero-cinematic-mask").forEach((mask) => {
    const image = mask.querySelector<HTMLElement>(".hero-cinematic-img");
    if (!image) return;
    const tween = gsap.fromTo(
      image,
      { scale: 1.12 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: mask,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    cleanups.push(() => tween.kill());
  });

  return () => cleanups.forEach((cleanup) => cleanup());
};

const animateHeroSerifSlides = (root: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const cleanups: Array<() => void> = [];
  root
    .querySelectorAll<HTMLElement>(".hero-serif-slide")
    .forEach((heading, index) => {
      const tween = gsap.fromTo(
        heading,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          delay: index * 0.07,
          ease: "power4.out",
        },
      );
      cleanups.push(() => tween.kill());
    });
  return () => cleanups.forEach((cleanup) => cleanup());
};

const animateTourCard = (card: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const tween = gsap.fromTo(
    card,
    { y: 28, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 88%", once: true },
    },
  );
  return () => {
    tween.kill();
  };
};

const animateTourCards = (root: HTMLElement) => {
  const cleanups: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>(".tour-card-discrete").forEach((card) => {
    const cleanup = animateTourCard(card);
    if (cleanup) cleanups.push(cleanup);
  });
  return () => cleanups.forEach((cleanup) => cleanup());
};

export const animateTourFilterPanelElement = (panel: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const tween = gsap.fromTo(
    panel,
    { x: -24, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
  );
  return () => {
    tween.kill();
  };
};

const animateTourFilterPanel = (root: HTMLElement) => {
  const panel = root.querySelector<HTMLElement>(".tour-filter-panel");
  return panel ? animateTourFilterPanelElement(panel) : undefined;
};

const animateTourCartPanels = (root: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const cleanups: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>(".tour-cart-panel").forEach((panel) => {
    const tween = gsap.fromTo(
      panel,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: panel, start: "top 92%", once: true },
      },
    );
    cleanups.push(() => tween.kill());
  });
  return () => cleanups.forEach((cleanup) => cleanup());
};

const animateGearPanel = (panel: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const image = panel.querySelector<HTMLElement>("[data-gear-image]");
  const cta = panel.querySelector<HTMLElement>(".gear-cta-magnetic");
  const cleanups: Array<() => void> = [];

  if (image) {
    const hover = gsap.to(image, {
      scale: 1.06,
      duration: 0.7,
      paused: true,
      ease: "power3.out",
    });
    const onEnter = () => hover.play();
    const onLeave = () => hover.reverse();
    panel.addEventListener("mouseenter", onEnter);
    panel.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      panel.removeEventListener("mouseenter", onEnter);
      panel.removeEventListener("mouseleave", onLeave);
      hover.kill();
    });
  }

  if (cta) {
    const strength = Number(cta.dataset.magneticStrength || 0.18);
    const xTo = gsap.quickTo(cta, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(cta, "y", { duration: 0.45, ease: "power3.out" });
    const onMove = (event: MouseEvent) => {
      const bounds = cta.getBoundingClientRect();
      xTo((event.clientX - (bounds.left + bounds.width / 2)) * strength);
      yTo((event.clientY - (bounds.top + bounds.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    cta.addEventListener("mousemove", onMove);
    cta.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      cta.removeEventListener("mousemove", onMove);
      cta.removeEventListener("mouseleave", onLeave);
      xTo(0);
      yTo(0);
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
};

const animateGearPanels = (root: HTMLElement) => {
  const cleanups: Array<() => void> = [];
  root
    .querySelectorAll<HTMLElement>(".gear-panel-isolated")
    .forEach((panel) => {
      const cleanup = animateGearPanel(panel);
      if (cleanup) cleanups.push(cleanup);
    });
  return () => cleanups.forEach((cleanup) => cleanup());
};

const animateStatCounter = (counter: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || "";
  const value = { current: 0 };
  const tween = gsap.to(value, {
    current: target,
    duration: 1.6,
    ease: "power2.out",
    scrollTrigger: { trigger: counter, start: "top 85%", once: true },
    onUpdate: () => {
      counter.textContent = `${Math.round(value.current)}${suffix}`;
    },
  });
  return () => tween.kill();
};

const animateStatCounters = (root: HTMLElement) => {
  const cleanups: Array<() => void> = [];
  root
    .querySelectorAll<HTMLElement>(".stat-counter-isolated")
    .forEach((counter) => {
      const cleanup = animateStatCounter(counter);
      if (cleanup) cleanups.push(cleanup);
    });
  return () => cleanups.forEach((cleanup) => cleanup());
};

const animateHomeScrollReveal = (root: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const cleanups: Array<() => void> = [];
  root
    .querySelectorAll<HTMLElement>(".home-scroll-reveal")
    .forEach((element, index) => {
      const tween = gsap.fromTo(
        element,
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: Math.min(index * 0.04, 0.2),
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        },
      );
      cleanups.push(() => tween.kill());
    });
  return () => cleanups.forEach((cleanup) => cleanup());
};

export const orchestrateGsap = (root: HTMLElement) => {
  const cleanups = [
    animateNavbar(root),
    animateHeroCinematicCamera(root),
    animateHeroSerifSlides(root),
    animateTourCards(root),
    animateTourFilterPanel(root),
    animateTourCartPanels(root),
    animateGearPanels(root),
    animateStatCounters(root),
    animateHomeScrollReveal(root),
  ].filter((cleanup): cleanup is () => void => Boolean(cleanup));

  ScrollTrigger.refresh();
  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
};
