/*
 * Suit la lecture de la page Sertelle : calcule la progression p (0 → 5) au défilement
 * et l'écrit dans la variable CSS --p. Un seul écouteur, cadencé par requestAnimationFrame.
 * Remplace les centaines de repères invisibles de la maquette.
 */
import { ciblesAtteignables, etapeActive, progression } from '../lib/sertelle';
import { ETAPES } from '../components/sertelle/etapes';

let arreter: (() => void) | undefined;

function installer() {
  arreter?.();
  const sections = ETAPES.map(({ id }) => document.getElementById(id));
  if (sections.some((s) => !s)) return;

  const racine = document.documentElement;
  const liens = document.querySelectorAll<HTMLAnchorElement>('[data-etape]');
  const numero = document.querySelector('[data-etape-numero]');
  const label = document.querySelector('[data-etape-label]');
  let active = -1;
  let enAttente = false;

  const mesurer = () => {
    enAttente = false;
    // Frontières : le haut des sections 2 à 6. L'anneau ne tourne qu'en les franchissant.
    const frontieres = sections.slice(1).map((s) => s!.getBoundingClientRect().top + window.scrollY);
    // Point de lecture : le milieu de l'écran, qui va de min (haut de page) à max (bas de page)
    const demiEcran = window.innerHeight / 2;
    const max = document.documentElement.scrollHeight - window.innerHeight + demiEcran;
    // Le passage d'une étape à l'autre s'étale sur 40 % de la hauteur de l'écran
    const largeur = window.innerHeight * 0.4;
    // Les dernières frontières, trop bas pour être franchies, sont ramenées à portée
    const atteignables = ciblesAtteignables(frontieres, demiEcran + largeur / 2, max - largeur / 2, largeur);
    const p = progression(window.scrollY + demiEcran, atteignables, largeur);
    racine.style.setProperty('--p', p.toFixed(4));

    const i = etapeActive(p);
    if (i !== active) {
      active = i;
      liens.forEach((lien) => {
        if (Number(lien.dataset.etape) === i) lien.setAttribute('aria-current', 'location');
        else lien.removeAttribute('aria-current');
      });
      if (numero) numero.textContent = ETAPES[i].numero;
      if (label) label.textContent = ETAPES[i].label;
    }
  };

  const planifier = () => {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(mesurer);
  };

  window.addEventListener('scroll', planifier, { passive: true });
  window.addEventListener('resize', planifier);
  mesurer();

  arreter = () => {
    window.removeEventListener('scroll', planifier);
    window.removeEventListener('resize', planifier);
    racine.style.removeProperty('--p');
    arreter = undefined;
  };
}

document.addEventListener('astro:page-load', installer);
// En quittant la page (View Transitions), on retire l'écouteur
document.addEventListener('astro:before-swap', () => arreter?.());
