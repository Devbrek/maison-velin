/*
 * Images Open Graph (1200 × 630), générées à la compilation.
 * satori met en page (textes vectorisés avec les vraies polices), sharp convertit en JPEG.
 * Polices : fichiers WOFF Fontsource (licence OFL) rangés dans src/og/polices.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

export const LARGEUR = 1200;
export const HAUTEUR = 630;

// Racine du projet : le build est lancé depuis là (import.meta.url pointerait vers le code compilé dans dist/)
const lire = (chemin: string) => readFileSync(join(process.cwd(), chemin));

const police = (name: string, fichier: string, weight: 300 | 400 | 500 | 600, style: 'normal' | 'italic' = 'normal') => ({
  name,
  data: lire(`src/og/polices/${fichier}.woff`),
  weight,
  style,
});

const POLICES = [
  police('Bodoni Moda', 'bodoni-moda-400-normal', 400),
  police('Jost', 'jost-400-normal', 400),
  police('Jost', 'jost-500-normal', 500),
  police('Saira', 'saira-600-normal', 600),
  police('Fraunces', 'fraunces-300-italic', 300, 'italic'),
  police('Fraunces', 'fraunces-400-normal', 400),
  police('Cormorant Garamond', 'cormorant-garamond-400-normal', 400),
];

// Petit constructeur d'éléments au format attendu par satori (sans JSX)
type Noeud = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...enfants: (Noeud | string)[]): Noeud => ({
  type,
  props: { style: { display: 'flex', ...style }, children: enfants.length === 1 ? enfants[0] : enfants },
});
const img = (src: string, style: Record<string, unknown>): Noeud => ({ type: 'img', props: { src, style } });

const VELIN = '#F3EEE4';
const ENCRE = '#141311';
const SECONDAIRE = '#5A554D';

/** Recadre une photo en 1200 × 630, en respectant une position CSS (« center 45% », « 28% center »…) */
async function photoRecadree(chemin: string, position: string): Promise<string> {
  const source = sharp(lire(chemin));
  const { width = 1, height = 1 } = await source.metadata();
  const [px, py] = position.split(' ').map((v) => (v === 'center' ? 0.5 : parseFloat(v) / 100));
  const echelle = Math.max(LARGEUR / width, HAUTEUR / height);
  const l = Math.round(width * echelle);
  const hh = Math.round(height * echelle);
  const jpeg = await source
    .resize(l, hh)
    .extract({ left: Math.round((l - LARGEUR) * px), top: Math.round((hh - HAUTEUR) * py), width: LARGEUR, height: HAUTEUR })
    .jpeg({ quality: 85 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
}

const logo = (variante: 'horizontal' | 'horizontal-clair') =>
  `data:image/svg+xml;base64,${lire(`src/assets/logo/${variante}.svg`).toString('base64')}`;

async function enJpeg(noeud: Noeud): Promise<Buffer> {
  const svg = await satori(noeud as never, { width: LARGEUR, height: HAUTEUR, fonts: POLICES as never });
  return sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
}

/** Accueil et pages Maison Vélin : le logo sur fond vélin, avec un titre de page facultatif */
export async function carteVelin(titre?: string): Promise<Buffer> {
  return enJpeg(
    h(
      'div',
      { width: '100%', height: '100%', background: VELIN, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 },
      img(logo('horizontal'), { height: titre ? 150 : 230 }),
      h(
        'div',
        { fontFamily: titre ? 'Bodoni Moda' : 'Jost', fontSize: titre ? 64 : 24, letterSpacing: titre ? 0 : 7, color: titre ? ENCRE : SECONDAIRE },
        titre ?? 'TEMPLATES DE SITES POUR MAISONS DE LUXE',
      ),
    ),
  );
}

export interface CartePhoto {
  photo: string; // chemin depuis la racine du projet
  position: string;
  surtitre: string;
  nom: string;
  police: { fontFamily: string; fontWeight: number; fontStyle?: string; textTransform?: string; letterSpacing?: number };
  pied: string; // ligne du bas (ex. « Démo de la pièce Filigrane · Maison Vélin »)
}

/** Fiches pièces et démos : la photo d'ouverture, un voile à gauche, le nom dans sa police */
export async function cartePhoto(c: CartePhoto): Promise<Buffer> {
  return enJpeg(
    h(
      'div',
      { width: '100%', height: '100%', position: 'relative', background: '#2B2723' },
      img(await photoRecadree(c.photo, c.position), { position: 'absolute', top: 0, left: 0, width: LARGEUR, height: HAUTEUR }),
      h('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        width: LARGEUR,
        height: HAUTEUR,
        backgroundImage: 'linear-gradient(to right, rgba(15,14,12,0.92) 0%, rgba(15,14,12,0.72) 45%, rgba(15,14,12,0.1) 80%)',
      }),
      h(
        'div',
        { position: 'absolute', left: 80, top: 0, height: HAUTEUR, flexDirection: 'column', justifyContent: 'center', gap: 24, color: VELIN },
        h('div', { fontFamily: 'Jost', fontWeight: 500, fontSize: 22, letterSpacing: 6, color: '#D9D2C5' }, c.surtitre),
        h('div', { fontSize: 112, lineHeight: 1, ...c.police }, c.nom),
        h('div', { fontFamily: 'Jost', fontSize: 24, color: '#E4DDD0' }, c.pied),
      ),
      img(logo('horizontal-clair'), { position: 'absolute', right: 56, bottom: 44, height: 64 }),
    ),
  );
}
