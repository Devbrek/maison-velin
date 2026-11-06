/*
 * Maths de la démo Sertelle : la loupe sur la Bague Lagon et l'anneau « fil d'Ariane ».
 * Fonctions pures (aucun accès au DOM) : faciles à tester avec Vitest.
 */

/* ───────────── Loupe ───────────── */

export const ZOOM = 2.6;

const borner = (valeur: number, min: number, max: number) => Math.min(max, Math.max(min, valeur));

/** Diamètre de la lentille en px : 26 % de la largeur de la photo, entre 130 et 220 px */
export function diametreLentille(largeurImage: number): number {
  return Math.round(borner(largeurImage * 0.26, 130, 220));
}

/** Position d'un pointeur dans la photo, en % (bornée à la photo) */
export function pointeurEnPourcent(
  clientX: number,
  clientY: number,
  cadre: { left: number; top: number; width: number; height: number },
): { x: number; y: number } {
  return {
    x: borner(((clientX - cadre.left) / cadre.width) * 100, 0, 100),
    y: borner(((clientY - cadre.top) / cadre.height) * 100, 0, 100),
  };
}

export interface Lentille {
  diametre: number;
  fondLargeur: number; // background-size en px (pas en %)
  fondHauteur: number;
  fondX: number; // background-position en px
  fondY: number;
}

/**
 * Réglages de la lentille centrée sur (x %, y %) d'une photo affichée en largeur × hauteur px.
 * Le fond est la même photo agrandie ZOOM fois ; on le décale pour que le point visé
 * tombe au centre de la lentille (avec background-origin: border-box).
 */
export function calculerLentille(x: number, y: number, largeur: number, hauteur: number, zoom = ZOOM): Lentille {
  const diametre = diametreLentille(largeur);
  const fondLargeur = Math.round(largeur * zoom);
  const fondHauteur = Math.round(hauteur * zoom);
  return {
    diametre,
    fondLargeur,
    fondHauteur,
    fondX: Math.round(diametre / 2 - (x / 100) * fondLargeur),
    fondY: Math.round(diametre / 2 - (y / 100) * fondHauteur),
  };
}

/* ───────────── Anneau ───────────── */

export const RAYON = 300;
export const NB_GRIFFES = 36; // une griffe tous les 10°
// Degrés entre deux étapes : un multiple de l'écart des griffes, pour que chaque étape soit posée sur une griffe
export const PAS_ETAPE = 30;
export const ANGLE_PIERRE = 180; // la pierre est fixe, au point le plus à gauche

/** Angle d'une étape i quand la progression vaut p (180° = sous la pierre) */
export function angleEtape(i: number, p: number): number {
  return ANGLE_PIERRE - (i - p) * PAS_ETAPE;
}

/** Une étape s'efface en s'éloignant de la pierre ; invisible au-delà de 95° */
export function opaciteEtape(angle: number): number {
  return Math.max(0, 1 - Math.abs(angle - ANGLE_PIERRE) / 95);
}

/** Angle de la griffe k : elles tournent avec la page, au même rythme que les étapes */
export function angleGriffe(k: number, p: number): number {
  return k * (360 / NB_GRIFFES) + p * PAS_ETAPE;
}

/** Coordonnées (px) d'un point de l'anneau, dans une boîte de 2R × 2R */
export function pointSurAnneau(angleDeg: number, rayon: number, R = RAYON): { left: number; top: number } {
  const a = (angleDeg * Math.PI) / 180;
  return { left: R + rayon * Math.cos(a), top: R + rayon * Math.sin(a) };
}

/* ───────────── Progression dans la page ───────────── */

/**
 * Positions atteignables : le point de lecture (milieu de l'écran) ne peut pas aller
 * plus haut que `min` (page tout en haut) ni plus bas que `max` (page tout en bas).
 * Les positions hors d'atteinte sont ramenées dans cet intervalle, en gardant au moins
 * `ecart` px entre deux, pour que chaque étape finisse par passer sous la pierre.
 */
export function ciblesAtteignables(positions: number[], min: number, max: number, ecart = 40): number[] {
  const n = positions.length;
  const cibles = positions.slice();
  // Fin de page : on recule les dernières cibles sous `max`
  for (let i = n - 1; i >= 0; i--) {
    const plafond = i === n - 1 ? max : cibles[i + 1] - ecart;
    cibles[i] = Math.min(cibles[i], plafond);
  }
  // Haut de page : la première cible est atteinte dès l'arrivée
  for (let i = 0; i < n; i++) {
    const plancher = i === 0 ? min : cibles[i - 1] + ecart;
    cibles[i] = Math.max(cibles[i], plancher);
  }
  return cibles;
}

/**
 * Progression par paliers : p reste entier tant qu'une section occupe le point de lecture,
 * et ne tourne qu'au passage d'une frontière entre deux sections.
 * `frontieres` : haut des sections 1 à n − 1 (là où l'on change d'étape), dans l'ordre.
 * `largeur` : distance de défilement (px) sur laquelle l'anneau passe d'une étape à la suivante,
 * centrée sur la frontière. Résultat borné entre 0 et le nombre de frontières.
 */
export function progression(repere: number, frontieres: number[], largeur: number): number {
  return frontieres.reduce((p, frontiere) => p + borner((repere - (frontiere - largeur / 2)) / largeur, 0, 1), 0);
}

/** Section en cours : la plus proche de la pierre */
export function etapeActive(p: number): number {
  return Math.round(p);
}
