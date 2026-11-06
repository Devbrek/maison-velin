/*
 * Apparitions au défilement : chaque [data-apparition] reçoit data-vu="oui"
 * quand 15 % de sa hauteur est à l'écran (une seule fois). Le CSS fait le reste.
 */

let observateur: IntersectionObserver | undefined;

export function mouvementReduit(): boolean {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.mouvement === 'reduit'
  );
}

function installer() {
  observateur?.disconnect();
  const sections = document.querySelectorAll<HTMLElement>('[data-apparition]:not([data-vu="oui"])');
  if (sections.length === 0) return;

  if (mouvementReduit() || !('IntersectionObserver' in window)) {
    sections.forEach((s) => (s.dataset.vu = 'oui'));
    return;
  }

  observateur = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (e.intersectionRatio >= 0.15) {
          (e.target as HTMLElement).dataset.vu = 'oui';
          observateur?.unobserve(e.target);
        }
      }
    },
    { threshold: [0, 0.15] },
  );
  sections.forEach((s) => observateur?.observe(s));
}

document.addEventListener('astro:page-load', installer);
