/*
 * Calculs des réglages d'images (fonctions pures, testées avec Vitest).
 */

/** Largeurs proposées au navigateur ; jamais au-delà de la photo d'origine (pas d'agrandissement) */
export const LARGEURS = [480, 800, 1200, 1600, 2400];

export function largeursPhoto(largeurSource: number): number[] {
  const largeurs = LARGEURS.filter((l) => l < largeurSource);
  // La pleine définition est toujours proposée
  return [...largeurs, largeurSource];
}

/**
 * De combien une photo est agrandie par object-fit: cover dans sa boîte.
 * `ratioPhoto`, `ratioCadre` : largeur / hauteur. Une photo plus « large » que la boîte
 * est mise à la hauteur de la boîte, et déborde en largeur.
 */
export function facteurCouverture(ratioPhoto: number, ratioCadre: number): number {
  return Math.max(1, ratioPhoto / ratioCadre);
}

/**
 * Multiplie chaque largeur d'un attribut `sizes` par `facteur`.
 * « (min-width: 64rem) 440px, 90vw » × 2 → « (min-width: 64rem) calc(440px * 2), calc(90vw * 2) »
 */
export function sizesAgrandis(sizes: string, facteur: number): string {
  if (facteur <= 1.01) return sizes;
  const f = facteur.toFixed(2);
  return sizes
    .split(/,(?![^(]*\))/) // virgules hors parenthèses
    .map((entree) => {
      const morceaux = entree.trim().match(/^(\(.*?\))\s+(.+)$/);
      const largeur = morceaux ? morceaux[2] : entree.trim();
      const agrandie = `calc(${largeur} * ${f})`;
      return morceaux ? `${morceaux[1]} ${agrandie}` : agrandie;
    })
    .join(', ');
}
