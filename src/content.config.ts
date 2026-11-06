import { defineCollection, reference } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Une couleur hexadécimale : #RGB ou #RRGGBB
const hex = z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Couleur hexadécimale attendue');

/** Une ligne « clé → valeur » (caractéristiques, fiche technique…) */
const ligne = z.object({ cle: z.string(), valeur: z.string() });

/* ───────────── Les pièces Maison Vélin ───────────── */

const pieces = defineCollection({
  loader: file('src/content/pieces.json'),
  schema: ({ image }) =>
    z.object({
      ordre: z.number().int(),
      nom: z.string(),
      // Variable CSS de la police dans laquelle le nom de la pièce est écrit (ex. --font-saira)
      policeNom: z.string().startsWith('--font-'),
      univers: z.array(z.string()).min(1),
      intro: z.string(),
      marqueDemo: z.object({ nom: z.string(), href: z.string() }),
      couverture: z.object({ src: image(), position: z.string() }),
      // Bloc de la pièce sur l'accueil Maison Vélin
      accueil: z.object({
        accroche: z.string(),
        image: image(),
        position: z.string(),
        mise: z.enum(['bas-gauche', 'droite', 'haut-gauche']),
      }),
      pourQui: z.object({ surtitre: z.string(), titre: z.string(), texte: z.string() }),
      contenu: z.array(z.object({ nom: z.string(), detail: z.string() })).min(1),
      matieres: z.array(z.object({ titre: z.string(), texte: z.string() })).length(4),
      configurateur: z.object({
        // Chaque accent existe en version pour fond clair et pour fond sombre
        accents: z.array(z.object({ id: z.string(), label: z.string(), clair: hex, sombre: hex })).min(2),
        polices: z
          .array(z.object({ id: z.string(), label: z.string(), police: z.string().startsWith('--font-'), note: z.string() }))
          .min(2),
        ambiances: z
          .array(
            z.object({
              id: z.string(),
              label: z.string(),
              sombre: z.boolean(),
              couleurs: z.object({ fond: hex, encre: hex, secondaire: hex, surface: hex.optional() }),
            }),
          )
          .length(2),
      }),
      preuves: z.object({
        mention: z.string(),
        engagements: z.array(z.string()).min(1),
      }),
      suivante: reference('pieces'),
    }),
});

/* ───────────── Démo Vecteur → Aubrek ───────────── */

const modelesAubrek = defineCollection({
  loader: file('src/content/modeles-aubrek.json'),
  schema: ({ image }) =>
    z.object({
      ordre: z.number().int(),
      nom: z.string(),
      accroche: z.string(),
      image: z.object({ src: image(), position: z.string(), alt: z.string().min(1) }),
      caracteristiques: z.array(ligne).min(1),
      // Seul Orage a une fiche modèle avec configurateur
      configuration: z
        .object({
          boitiers: z.array(z.object({ id: z.string(), label: z.string(), poids: z.string() })).min(1),
          bracelets: z.array(z.object({ id: z.string(), label: z.string(), teinte: hex })).min(1),
        })
        .optional(),
    }),
});

/* ───────────── Démo Lavis → Calade ───────────── */

const parfumsCalade = defineCollection({
  loader: file('src/content/parfums-calade.json'),
  schema: ({ image }) =>
    z.object({
      ordre: z.number().int(),
      nom: z.string(),
      chapitre: z.enum(['matin', 'midi', 'soir']),
      numero: z.string(), // chiffre romain : I, II, III
      heure: z.string().regex(/^\d{2}:\d{2}$/),
      moment: z.string(), // « LE MATIN », « MIDI », « LE SOIR »
      texte: z.string(),
      notes: z.array(z.string()).length(3), // tête · cœur · fond
      prix: z.number().positive(),
      image: z.object({ src: image(), position: z.string(), alt: z.string().min(1) }),
    }),
});

/* ───────────── Démo Filigrane → Sertelle ───────────── */

const bijouxSertelle = defineCollection({
  loader: file('src/content/bijoux-sertelle.json'),
  schema: ({ image }) =>
    z.object({
      ordre: z.number().int(),
      nom: z.string(),
      prix: z.number().positive(),
      image: z.object({ src: image(), position: z.string(), alt: z.string().min(1) }),
      // Points d'intérêt de la loupe, en % de la largeur / hauteur de la photo
      pointsLoupe: z
        .array(
          z.object({
            id: z.string(),
            numero: z.string(),
            x: z.number().min(0).max(100),
            y: z.number().min(0).max(100),
            titre: z.string(),
            texte: z.string(),
          }),
        )
        .optional(),
    }),
});

export const collections = { pieces, modelesAubrek, parfumsCalade, bijouxSertelle };
