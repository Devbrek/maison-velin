import { describe, expect, it } from 'vitest';
import { LARGEUR_RENDU, ajusterApercu } from './ajustement';

describe("ajustement de l'aperçu collé (téléphone)", () => {
  it('réduit pour tenir dans la largeur quand la hauteur le permet', () => {
    // Écran de 390 px : cadre de 358 px, aperçu de 500 px de haut, 300 px disponibles
    const a = ajusterApercu(358, 500, 300);
    expect(a.echelle).toBeCloseTo(358 / LARGEUR_RENDU);
    expect(a.hauteur).toBe(Math.round(500 * (358 / LARGEUR_RENDU)));
    expect(a.decalage).toBe(0);
  });

  it('réduit davantage quand la hauteur est la contrainte, et centre', () => {
    const a = ajusterApercu(358, 800, 240);
    expect(a.echelle).toBeCloseTo(0.3);
    expect(a.hauteur).toBe(240);
    expect(a.decalage).toBe(Math.round((358 - LARGEUR_RENDU * 0.3) / 2));
  });

  it("n'agrandit jamais", () => {
    expect(ajusterApercu(2000, 100, 1000).echelle).toBe(1);
  });
});
