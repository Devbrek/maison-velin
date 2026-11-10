/*
 * Garde-fou : l'anneau de l'écrin Sertelle doit être rendu (36 griffes, 6 étapes, la pierre),
 * rester décoratif (aria-hidden) avec sa navigation clavier, et être utilisé par la démo.
 * Rendu réel du composant avec l'API « container » d'Astro, puis lecture du HTML produit
 * (sans bibliothèque d'analyse HTML : le balisage est simple et stable).
 */
import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Ecrin from './Ecrin.astro';
import { ETAPES } from './etapes';
import { ANGLE_PIERRE, NB_GRIFFES, PAS_ETAPE, RAYON, pointSurAnneau } from '../../lib/sertelle';

let html = '';
const compter = (motif: RegExp) => html.match(new RegExp(motif.source, 'g'))?.length ?? 0;

beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(Ecrin);
});

describe("anneau de l'écrin Sertelle", () => {
  it('est rendu dans un écrin affiché en grand écran (à partir de 1024 px)', () => {
    expect(html).toMatch(/<aside[^>]*class="[^"]*\becrin\b[^"]*\blg:block\b/);
    expect(compter(/class="anneau-tournant\b/)).toBe(1);
  });

  it(`porte ${NB_GRIFFES} griffes, ${ETAPES.length} étapes et la pierre`, () => {
    // Les griffes sont les petits losanges tournés de 45° (la pierre a sa propre classe)
    expect(compter(/class="absolute -mt-\[2\.5px\] -ml-\[2\.5px\] size-\[5px\] rotate-45/)).toBe(NB_GRIFFES);
    expect(compter(/class="etape absolute/)).toBe(ETAPES.length);
    const libelles = [...html.matchAll(/class="etape-texte[^"]*"[^>]*data-texte="([^"]+)"/g)].map((m) => m[1]);
    expect(libelles).toEqual(ETAPES.map((e) => e.label.replace("'", '&#39;')));
    expect(compter(/class="pierre\b/)).toBe(1);
  });

  it('place la première étape sur la pierre, à 180°', () => {
    const { left, top } = pointSurAnneau(ANGLE_PIERRE, RAYON - 11);
    const premiere = html.match(/class="etape absolute[^"]*"[^>]*style="([^"]+)"/)![1];
    expect(premiere).toContain(`left:${left.toFixed(1)}px`);
    expect(premiere).toContain(`top:${top.toFixed(1)}px`);
    expect(html).toContain(`--pas:${PAS_ETAPE}`);
  });

  it('reste décoratif, avec une navigation clavier équivalente', () => {
    // La boîte qui contient l'anneau est masquée aux lecteurs d'écran
    expect(html).toMatch(/<div aria-hidden="true"[^>]*style="--pas:[^"]*"[^>]*>\s*<div[^>]*>[\s\S]*class="anneau-tournant/);
    // Les étapes de l'anneau sont hors du parcours clavier…
    expect(compter(/tabindex="-1"[^>]*data-etape=/)).toBe(ETAPES.length);
    // … la navigation clavier reprend les six sections, dans l'ordre
    const nav = html.slice(html.indexOf('class="nav-clavier'), html.indexOf('</nav>'));
    expect([...nav.matchAll(/href="#([^"]+)"/g)].map((m) => m[1])).toEqual(ETAPES.map((e) => e.id));
  });

  it('est bien utilisé par la page de démo', () => {
    const page = readFileSync('src/pages/demos/sertelle.astro', 'utf8');
    expect(page).toMatch(/import Ecrin from ['"][^'"]*Ecrin\.astro['"]/);
    expect(page).toMatch(/<Ecrin[\s/>]/);
  });
});
