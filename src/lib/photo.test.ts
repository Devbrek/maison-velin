import { describe, expect, it } from 'vitest';
import { facteurCouverture, largeursPhoto, sizesAgrandis } from './photo';

describe('largeurs proposées', () => {
  it("s'arrête à la largeur de la photo d'origine, toujours incluse", () => {
    expect(largeursPhoto(1800)).toEqual([480, 800, 1200, 1600, 1800]);
    expect(largeursPhoto(1012)).toEqual([480, 800, 1012]);
    expect(largeursPhoto(3448)).toEqual([480, 800, 1200, 1600, 2400, 3448]);
  });
});

describe('agrandissement par object-fit: cover', () => {
  it('ne change rien quand la photo est moins large que sa boîte', () => {
    expect(facteurCouverture(2 / 3, 4 / 5)).toBe(1);
  });

  it("calcule l'agrandissement d'une photo paysage dans une arche", () => {
    // Le Soir : 1800 × 1015 dans une boîte de 440 × 646
    expect(facteurCouverture(1800 / 1015, 440 / 646)).toBeCloseTo(2.6, 1);
  });
});

describe('sizes agrandis', () => {
  it('laisse les sizes intacts sans agrandissement', () => {
    expect(sizesAgrandis('(min-width: 64rem) 440px, 90vw', 1)).toBe('(min-width: 64rem) 440px, 90vw');
  });

  it('multiplie chaque largeur, conditions comprises', () => {
    expect(sizesAgrandis('(min-width: 64rem) 440px, calc(100vw - 104px)', 2.6)).toBe(
      '(min-width: 64rem) calc(440px * 2.60), calc(calc(100vw - 104px) * 2.60)',
    );
  });
});
