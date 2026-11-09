/*
 * Scores Lighthouse réellement mesurés sur le site en ligne (PageSpeed Insights, mobile).
 * Source unique : src/data/mesures-lighthouse.json, validé ici par Zod au build.
 * Aucun chiffre inventé : une page absente du fichier fait échouer le build.
 */
import { z } from 'astro/zod';
import donnees from '../data/mesures-lighthouse.json';

const score = z.number().int().min(0).max(100);

const schema = z.object({
  outil: z.string(),
  strategie: z.literal('mobile'),
  date: z.iso.date(),
  pages: z.array(
    z.object({
      chemin: z.string().startsWith('/'),
      nom: z.string(),
      scores: z.object({ performance: score, accessibilite: score, bonnesPratiques: score, seo: score }),
      rapport: z.url().startsWith('https://pagespeed.web.dev/'),
    }),
  ),
});

export const MESURES = schema.parse(donnees);
export type MesurePage = (typeof MESURES)['pages'][number];

/** Libellés affichés, dans l'ordre de Lighthouse */
export const CATEGORIES = [
  ['performance', 'Performance'],
  ['accessibilite', 'Accessibilité'],
  ['bonnesPratiques', 'Bonnes pratiques'],
  ['seo', 'SEO'],
] as const;

export function mesureDe(chemin: string, mesures = MESURES): MesurePage {
  const page = mesures.pages.find((p) => p.chemin === chemin);
  if (!page) throw new Error(`Aucune mesure Lighthouse pour ${chemin} (src/data/mesures-lighthouse.json)`);
  return page;
}

/** « 9 novembre 2026 » (date seule, sans décalage de fuseau ; espace insécable entre le jour et le mois) */
export function dateMesure(iso: string = MESURES.date): string {
  const [annee, mois, jour] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(annee, mois - 1, jour)),
  ).replace(/^(\d+) /, '$1 ');
}

/** « 100 / 100 / 100 / 100 » */
export function scoresEnLigne(page: MesurePage): string {
  return CATEGORIES.map(([cle]) => page.scores[cle]).join(' / ');
}
