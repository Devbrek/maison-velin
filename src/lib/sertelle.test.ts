import { describe, expect, it } from 'vitest';
import {
  angleEtape,
  angleGriffe,
  calculerLentille,
  ciblesAtteignables,
  diametreLentille,
  etapeActive,
  opaciteEtape,
  pointeurEnPourcent,
  pointSurAnneau,
  progression,
} from './sertelle';

describe('loupe', () => {
  it('borne le diamètre de la lentille entre 130 et 220 px', () => {
    expect(diametreLentille(300)).toBe(130); // 78 → 130
    expect(diametreLentille(600)).toBe(156); // 26 %
    expect(diametreLentille(1200)).toBe(220); // 312 → 220
  });

  it('agrandit le fond 2,6 fois, en px', () => {
    const l = calculerLentille(50, 50, 760, 511);
    expect(l.fondLargeur).toBe(1976);
    expect(l.fondHauteur).toBe(1329);
  });

  it('place le point visé au centre de la lentille', () => {
    // Point (53,5 %, 28 %) d'une photo de 760 × 511 px
    const l = calculerLentille(53.5, 28, 760, 511);
    expect(l.diametre).toBe(198);
    // Le pixel visé dans le fond agrandi, décalé de fondX, doit tomber à D/2
    const pixelVise = 0.535 * l.fondLargeur;
    expect(Math.abs(pixelVise + l.fondX - l.diametre / 2)).toBeLessThanOrEqual(1);
    expect(l.fondX).toBe(Math.round(99 - 0.535 * 1976));
    expect(l.fondY).toBe(Math.round(99 - 0.28 * 1329));
  });

  it('coin haut gauche : le fond commence au centre de la lentille', () => {
    const l = calculerLentille(0, 0, 760, 511);
    expect(l.fondX).toBe(99);
    expect(l.fondY).toBe(99);
  });

  it('convertit un pointeur en %, borné à la photo', () => {
    const cadre = { left: 100, top: 50, width: 400, height: 200 };
    expect(pointeurEnPourcent(300, 150, cadre)).toEqual({ x: 50, y: 50 });
    expect(pointeurEnPourcent(0, 999, cadre)).toEqual({ x: 0, y: 100 });
  });
});

describe('anneau', () => {
  it("met l'étape en cours sous la pierre (180°)", () => {
    expect(angleEtape(2, 2)).toBe(180);
    expect(angleEtape(3, 2)).toBe(150);
    expect(angleEtape(0, 2)).toBe(240);
  });

  it("efface les étapes qui s'éloignent de la pierre", () => {
    expect(opaciteEtape(180)).toBe(1);
    expect(opaciteEtape(180 - 30)).toBeCloseTo(1 - 30 / 95);
    expect(opaciteEtape(180 + 95)).toBe(0);
    expect(opaciteEtape(0)).toBe(0); // jamais négative
  });

  it('fait tourner les 36 griffes de 30° par section', () => {
    expect(angleGriffe(0, 0)).toBe(0);
    expect(angleGriffe(1, 0)).toBe(10);
    expect(angleGriffe(0, 1.5)).toBe(45);
  });

  it('pose chaque étape sur une griffe, quelle que soit la progression', () => {
    for (const p of [0, 0.37, 2, 4.8]) {
      for (let i = 0; i < 6; i++) {
        const surUneGriffe = Array.from({ length: 36 }, (_, k) => angleGriffe(k, p)).some((a) => {
          const ecart = (((a - angleEtape(i, p)) % 360) + 360) % 360;
          return Math.min(ecart, 360 - ecart) < 1e-6;
        });
        expect(surUneGriffe).toBe(true);
      }
    }
  });

  it("place un point sur l'anneau (180° = bord gauche)", () => {
    const gauche = pointSurAnneau(180, 289);
    expect(gauche.left).toBeCloseTo(11);
    expect(gauche.top).toBeCloseTo(300);
    const bas = pointSurAnneau(90, 300);
    expect(bas.left).toBeCloseTo(300);
    expect(bas.top).toBeCloseTo(600);
  });
});

describe('progression par paliers', () => {
  // Trois sections : la 2e commence à 1000 px, la 3e à 2000 px. Passage sur 400 px.
  const frontieres = [1000, 2000];
  const largeur = 400;

  it("reste sur l'étape tant que la section occupe le point de lecture", () => {
    expect(progression(0, frontieres, largeur)).toBe(0);
    expect(progression(790, frontieres, largeur)).toBe(0);
    expect(progression(1200, frontieres, largeur)).toBe(1);
    expect(progression(1500, frontieres, largeur)).toBe(1);
    expect(progression(1790, frontieres, largeur)).toBe(1);
  });

  it('tourne en douceur en franchissant une frontière', () => {
    expect(progression(900, frontieres, largeur)).toBe(0.25);
    expect(progression(1000, frontieres, largeur)).toBe(0.5); // pile sur la frontière : à mi-chemin
    expect(progression(2100, frontieres, largeur)).toBe(1.75);
  });

  it('ne dépasse jamais la dernière étape', () => {
    expect(progression(9999, frontieres, largeur)).toBe(2);
  });
});

describe('cibles atteignables', () => {
  it('garde les milieux qui sont atteignables', () => {
    expect(ciblesAtteignables([500, 1500, 2500], 450, 3000)).toEqual([500, 1500, 2500]);
  });

  it('ramène les dernières sections quand la page se termine avant leur milieu', () => {
    // Bas de page : le point de lecture ne descend pas plus bas que 2200
    expect(ciblesAtteignables([500, 1500, 2500, 2700], 450, 2200)).toEqual([500, 1500, 2160, 2200]);
  });

  it("atteint la première étape dès le haut de la page", () => {
    expect(ciblesAtteignables([300, 1500], 450, 3000)).toEqual([450, 1500]);
  });

  it('la dernière étape est atteinte tout en bas de la page', () => {
    // Bas de page : point de lecture max à 2200 ; frontières trop basses ramenées à portée
    const largeur = 300;
    const frontieres = ciblesAtteignables([1000, 2100, 2300], 450 + largeur / 2, 2200 - largeur / 2, largeur);
    expect(progression(2200, frontieres, largeur)).toBe(3);
  });

  it("choisit l'étape la plus proche", () => {
    expect(etapeActive(1.4)).toBe(1);
    expect(etapeActive(1.6)).toBe(2);
  });
});
