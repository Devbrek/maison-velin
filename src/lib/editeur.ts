/*
 * Informations légales de l'éditeur du site (mentions légales).
 * Un champ vide s'affiche « [À COMPLÉTER] » : impossible de publier sans le voir.
 */
export const EDITEUR = {
  nom: 'Benjamin Sanna EI', // la mention « EI » suit le nom d'un entrepreneur individuel
  nomCommercial: 'Devbrek',
  statut: 'Entrepreneur individuel (micro-entrepreneur)',
  siret: '851 990 895 00027',
  adresse: '781 avenue de Monsieur Teste, 34070 Montpellier, France',
  telephone: '+33 6 29 84 28 84',
  directeurPublication: 'Benjamin Sanna',
  site: 'https://devbrek.fr',
};

export const HEBERGEUR = {
  nom: 'Vercel Inc.',
  adresse: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
  site: 'https://vercel.com',
};

/** Valeur affichée, ou l'emplacement à compléter */
export const ouACompleter = (valeur: string, libelle = 'À COMPLÉTER') => valeur || `[${libelle}]`;
