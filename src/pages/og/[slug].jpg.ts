/*
 * Images Open Graph (1200 × 630), une par page : /og/<slug>.jpg
 * Générées à la compilation (sortie statique), jamais à la volée.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { carteVelin, cartePhoto } from '../../og/carte';

const saira = { fontFamily: 'Saira', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 4 };

const cartes: Record<string, () => Promise<Buffer>> = {
  accueil: () => carteVelin(),
  'savoir-faire': () => carteVelin('Le savoir-faire'),
  'sur-mesure': () => carteVelin('Sur mesure'),
  'mentions-legales': () => carteVelin('Mentions légales'),

  // Fiches pièces : photo d'ouverture + nom de la pièce dans sa police
  filigrane: () =>
    cartePhoto({
      photo: 'src/assets/sertelle/sertelle-alliance-riviere.jpg',
      position: 'center 62%',
      surtitre: 'PIÈCE · JOAILLERIE',
      nom: 'Filigrane',
      police: { fontFamily: 'Bodoni Moda', fontWeight: 400 },
      pied: 'Un template Maison Vélin by Devbrek',
    }),
  vecteur: () =>
    cartePhoto({
      photo: 'src/assets/aubrek/aubrek-pluie.jpg',
      position: 'center 45%',
      surtitre: 'PIÈCE · HORLOGERIE CONNECTÉE',
      nom: 'Vecteur',
      police: saira,
      pied: 'Un template Maison Vélin by Devbrek',
    }),
  lavis: () =>
    cartePhoto({
      photo: 'src/assets/calade/calade-ruelle.jpg',
      position: 'center 70%',
      surtitre: 'PIÈCE · PARFUM',
      nom: 'Lavis',
      police: { fontFamily: 'Fraunces', fontWeight: 300, fontStyle: 'italic' },
      pied: 'Un template Maison Vélin by Devbrek',
    }),

  // Démos : marque fictive, dite comme telle
  sertelle: () =>
    cartePhoto({
      photo: 'src/assets/sertelle/sertelle-alliance-riviere.jpg',
      position: 'center 60%',
      surtitre: 'DÉMO · MARQUE FICTIVE · JOAILLERIE',
      nom: 'Sertelle',
      police: { fontFamily: 'Cormorant Garamond', fontWeight: 400, letterSpacing: 18, textTransform: 'uppercase' },
      pied: 'Démonstration de la pièce Filigrane · Maison Vélin',
    }),
  aubrek: () =>
    cartePhoto({
      photo: 'src/assets/aubrek/aubrek-pluie.jpg',
      position: 'center 45%',
      surtitre: 'DÉMO · MARQUE FICTIVE · HORLOGERIE CONNECTÉE',
      nom: 'Aubrek',
      police: { ...saira, letterSpacing: 18 },
      pied: 'Démonstration de la pièce Vecteur · Maison Vélin',
    }),
  orage: () =>
    cartePhoto({
      photo: 'src/assets/aubrek/aubrek-orage-neon.jpg',
      position: 'center 52%',
      surtitre: 'DÉMO · MARQUE FICTIVE · AUBREK, FICHE MODÈLE',
      nom: 'Orage',
      police: saira,
      pied: 'Démonstration de la pièce Vecteur · Maison Vélin',
    }),
  calade: () =>
    cartePhoto({
      photo: 'src/assets/calade/calade-ruelle.jpg',
      position: 'center 70%',
      surtitre: 'DÉMO · MARQUE FICTIVE · PARFUMS DU SUD',
      nom: 'Calade',
      police: { fontFamily: 'Fraunces', fontWeight: 400, letterSpacing: 16, textTransform: 'uppercase' },
      pied: 'Démonstration de la pièce Lavis · Maison Vélin',
    }),
};

export const getStaticPaths = (() => Object.keys(cartes).map((slug) => ({ params: { slug } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const image = await cartes[params.slug as string]();
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/jpeg' } });
};
