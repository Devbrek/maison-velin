/*
 * Aperçu collé en haut de l'écran sur téléphone : il est rendu à une largeur fixe de « bureau »
 * (mise en page deux colonnes), puis réduit pour tenir dans la largeur disponible
 * ET dans la hauteur maximale (≈ 40 % de l'écran). Fonction pure, testée avec Vitest.
 */

/** Largeur à laquelle l'aperçu est dessiné avant réduction (déclenche sa mise en page deux colonnes) */
export const LARGEUR_RENDU = 640;

export interface Ajustement {
  echelle: number; // facteur de réduction (≤ 1)
  hauteur: number; // hauteur occupée après réduction, en px
  decalage: number; // marge à gauche pour centrer, en px
}

export function ajusterApercu(largeurCadre: number, hauteurContenu: number, hauteurMax: number): Ajustement {
  const echelle = Math.min(1, largeurCadre / LARGEUR_RENDU, hauteurMax / Math.max(1, hauteurContenu));
  return {
    echelle,
    hauteur: Math.round(hauteurContenu * echelle),
    decalage: Math.max(0, Math.round((largeurCadre - LARGEUR_RENDU * echelle) / 2)),
  };
}
