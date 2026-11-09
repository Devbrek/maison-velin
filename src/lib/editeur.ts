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
  // Écrit sans arobase : les robots collecteurs d'adresses ne la reconnaissent pas
  email: 'contact [at] devbrek.fr',
  site: 'https://devbrek.fr',
};

/*
 * Les demandes passent par le formulaire du site Devbrek (Maison Vélin n'a pas de formulaire).
 * `source` permet à Devbrek de savoir que la demande vient de Maison Vélin.
 */
export const FORMULAIRE_DEVBREK = 'https://devbrek.fr/fr#contact'; // section « Parlons-en » de l'accueil Devbrek

// Le paramètre doit précéder l'ancre : https://devbrek.fr/fr?source=maison-velin#contact
const url = new URL(FORMULAIRE_DEVBREK);
url.searchParams.set('source', 'maison-velin');
export const lienDemandeDevbrek = url.toString();

export const HEBERGEUR = {
  nom: 'Vercel Inc.',
  adresse: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
  site: 'https://vercel.com',
};

/** Valeur affichée, ou l'emplacement à compléter */
export const ouACompleter = (valeur: string, libelle = 'À COMPLÉTER') => valeur || `[${libelle}]`;
