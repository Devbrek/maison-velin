/*
 * Fil horaire de la promenade Calade : un seul écouteur de défilement, cadencé par
 * requestAnimationFrame. Il écrit --remplissage (0 → 1) et l'état des arrêts.
 * Remplace les repères invisibles de la maquette.
 */
import { chapitreActif, remplissageFil } from '../lib/calade';

const CHAPITRES = ['matin', 'midi', 'soir'] as const;
let arreter: (() => void) | undefined;

function installer() {
  arreter?.();
  const fil = document.querySelector<HTMLElement>('[data-fil]');
  const chapitres = CHAPITRES.map((c) => document.getElementById(`chap-${c}`));
  if (!fil || chapitres.some((c) => !c)) return;

  const arrets = fil.querySelectorAll<HTMLElement>('[data-arret]');
  let actif = -1;
  let enAttente = false;

  const mesurer = () => {
    enAttente = false;
    const debuts = chapitres.map((c) => c!.getBoundingClientRect().top + window.scrollY);
    const repere = window.scrollY + window.innerHeight / 2;
    fil.style.setProperty('--remplissage', remplissageFil(repere, debuts).toFixed(4));

    const i = chapitreActif(repere, debuts);
    if (i === actif) return;
    actif = i;
    fil.dataset.chapitre = CHAPITRES[i]; // couleurs du fil = celles du chapitre survolé
    arrets.forEach((arret, k) => {
      arret.dataset.etat = k < i ? 'passe' : k === i ? 'courant' : 'avenir';
      const lien = arret.querySelector('a');
      if (k === i) lien?.setAttribute('aria-current', 'step');
      else lien?.removeAttribute('aria-current');
    });
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
    arreter = undefined;
  };
}

document.addEventListener('astro:page-load', installer);
document.addEventListener('astro:before-swap', () => arreter?.());
