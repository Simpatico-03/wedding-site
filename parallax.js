document.addEventListener("DOMContentLoaded", () => {
  initParallax();
  initScrollReveal();
  initCountdown();
});

function initParallax() {
  const layers = Array.from(document.querySelectorAll(".parallax-layer"));
  if (!layers.length) return;

  let ticking = false;

  function updateLayers() {
    const scrollY = window.scrollY || window.pageYOffset;

    layers.forEach((layer) => {
      const speed = Number(layer.dataset.speed || 0);
      const offset = scrollY * speed;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateLayers);
      ticking = true;
    }
  }

  updateLayers();
  window.addEventListener("scroll", requestTick, { passive: true });
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal-item, .scroll-reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  items.forEach((item) => observer.observe(item));
}

function initCountdown() {
  const countdown = document.querySelector("[data-countdown]");
  if (!countdown) return;

  const target = new Date("2026-08-20T00:00:00+05:30").getTime();
  const values = {
    days: countdown.querySelector('[data-countdown-value="days"]'),
    hours: countdown.querySelector('[data-countdown-value="hours"]'),
    minutes: countdown.querySelector('[data-countdown-value="minutes"]'),
    seconds: countdown.querySelector('[data-countdown-value="seconds"]'),
  };

  function pad(value, size = 2) {
    return String(value).padStart(size, "0");
  }

  function updateCountdown() {
    const now = Date.now();
    const distance = Math.max(target - now, 0);

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    if (values.days) values.days.textContent = pad(days, 3);
    if (values.hours) values.hours.textContent = pad(hours);
    if (values.minutes) values.minutes.textContent = pad(minutes);
    if (values.seconds) values.seconds.textContent = pad(seconds);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}
