/*
 * Maths du fil horaire de la démo Calade (promenade en trois chapitres).
 * Fonctions pures, testées avec Vitest.
 */

/**
 * Remplissage du fil, de 0 à 1.
 * `repere` : position dans le document du milieu de l'écran.
 * `debuts` : haut de chaque chapitre dans le document (matin, midi, soir).
 * Chaque arrêt est atteint quand le haut de son chapitre passe le milieu de l'écran :
 * matin → 0, midi → 0,5, soir → 1 ; entre deux arrêts, le fil se remplit linéairement.
 */
export function remplissageFil(repere: number, debuts: number[]): number {
  const n = debuts.length;
  if (n < 2 || repere <= debuts[0]) return 0;
  const pas = 1 / (n - 1);
  for (let i = 0; i < n - 1; i++) {
    if (repere < debuts[i + 1]) {
      return i * pas + (pas * (repere - debuts[i])) / Math.max(1, debuts[i + 1] - debuts[i]);
    }
  }
  return 1;
}

/** Chapitre en cours : le dernier dont le haut a passé le milieu de l'écran (0 avant le premier) */
export function chapitreActif(repere: number, debuts: number[]): number {
  let actif = 0;
  debuts.forEach((debut, i) => {
    if (repere >= debut) actif = i;
  });
  return actif;
}
