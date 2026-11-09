import { describe, expect, it } from 'vitest';
import { MESURES, dateMesure, mesureDe, scoresEnLigne } from './mesures';

describe('mesures Lighthouse', () => {
  it("couvre l'accueil et les trois démos", () => {
    for (const chemin of ['/', '/demos/sertelle', '/demos/aubrek', '/demos/calade']) {
      expect(mesureDe(chemin).rapport).toMatch(/^https:\/\/pagespeed\.web\.dev\//);
    }
  });

  it('refuse une page non mesurée plutôt que d’inventer un score', () => {
    expect(() => mesureDe('/inconnue')).toThrow(/Aucune mesure/);
  });

  it('écrit la date en français, sans décalage de fuseau', () => {
    // Espace insécable ( ) entre le jour et le mois : « 9 » ne reste pas seul en fin de ligne
    expect(dateMesure('2026-11-09')).toBe('9 novembre 2026');
    expect(dateMesure()).toBe('9 novembre 2026');
  });

  it('met les quatre scores en ligne dans l’ordre de Lighthouse', () => {
    expect(scoresEnLigne(mesureDe('/demos/calade'))).toBe('97 / 100 / 100 / 100');
    expect(MESURES.strategie).toBe('mobile');
  });
});
