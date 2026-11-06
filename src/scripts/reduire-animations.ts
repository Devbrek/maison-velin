/*
 * Bouton « Réduire les animations » : s'ajoute à la préférence système.
 * Le choix est gardé dans le navigateur (localStorage) et appliqué avant l'affichage
 * par le script en ligne de BaseLayout.
 */
document.addEventListener('astro:page-load', () => {
  const racine = document.documentElement;
  document.querySelectorAll<HTMLButtonElement>('[data-reduire-animations]').forEach((bouton) => {
    const afficher = () => bouton.setAttribute('aria-pressed', String(racine.dataset.mouvement === 'reduit'));
    afficher();
    bouton.addEventListener('click', () => {
      const reduit = racine.dataset.mouvement !== 'reduit';
      if (reduit) racine.dataset.mouvement = 'reduit';
      else delete racine.dataset.mouvement;
      try {
        localStorage.setItem('mouvement', reduit ? 'reduit' : 'normal');
      } catch {
        // Stockage indisponible (navigation privée) : le choix vaut pour la page en cours
      }
      // Les apparitions en attente s'affichent tout de suite
      if (reduit) document.querySelectorAll<HTMLElement>('[data-apparition]').forEach((s) => (s.dataset.vu = 'oui'));
      afficher();
    });
  });
});
