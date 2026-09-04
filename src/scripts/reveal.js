let currentObserver = null;

export function initReveal() {
  if (currentObserver) {
    currentObserver.disconnect();
    currentObserver = null;
  }

  const elements = document.querySelectorAll('[data-reveal]');
  if (elements.length === 0) return;

  currentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  elements.forEach((el) => currentObserver?.observe(el));
}
