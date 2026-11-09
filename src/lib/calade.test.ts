import { describe, expect, it } from 'vitest';
import { chapitreActif, remplissageFil } from './calade';

// Trois chapitres : matin à 1000 px, midi à 1800 px, soir à 3000 px
const debuts = [1000, 1800, 3000];

describe('remplissage du fil', () => {
  it('reste vide avant le matin', () => {
    expect(remplissageFil(0, debuts)).toBe(0);
    expect(remplissageFil(1000, debuts)).toBe(0);
  });

  it('atteint chaque arrêt quand son chapitre passe le milieu de l’écran', () => {
    expect(remplissageFil(1800, debuts)).toBe(0.5); // midi
    expect(remplissageFil(3000, debuts)).toBe(1); // soir
  });

  it('se remplit linéairement entre deux arrêts, même si les chapitres ont des hauteurs différentes', () => {
    expect(remplissageFil(1400, debuts)).toBe(0.25); // à mi-chemin du matin (800 px)
    expect(remplissageFil(2400, debuts)).toBe(0.75); // à mi-chemin du midi (1200 px)
  });

  it('ne dépasse jamais 1', () => {
    expect(remplissageFil(99999, debuts)).toBe(1);
  });
});

describe('chapitre actif', () => {
  it('commence au matin', () => {
    expect(chapitreActif(0, debuts)).toBe(0);
  });

  it('change quand le haut du chapitre suivant passe le milieu de l’écran', () => {
    expect(chapitreActif(1799, debuts)).toBe(0);
    expect(chapitreActif(1800, debuts)).toBe(1);
    expect(chapitreActif(3500, debuts)).toBe(2);
  });
});
