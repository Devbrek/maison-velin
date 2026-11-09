import { describe, expect, it } from 'vitest';
import { CONTACT, emailAffiche, emailComplet, lienDemande } from './contact';

const demande = {
  nom: 'Claire Martin',
  maison: 'Maison & Fils',
  email: 'claire@exemple.fr',
  piece: 'Vecteur',
  message: 'Bonjour,\nnous lançons une montre.',
};

describe('adresse de contact', () => {
  it("s'affiche sans arobase, pour les robots collecteurs", () => {
    expect(emailAffiche).toBe('contact [at] devbrek.fr');
    expect(emailAffiche).not.toContain('@');
  });

  it('se reconstitue à partir de ses deux morceaux', () => {
    expect(emailComplet(CONTACT.utilisateur, CONTACT.domaine)).toBe('contact@devbrek.fr');
  });
});

describe('lien de demande sur mesure', () => {
  it("vise l'adresse de contact", () => {
    expect(lienDemande('contact@exemple.fr', demande)).toMatch(/^mailto:contact@exemple\.fr\?subject=/);
  });

  it('encode le sujet et le corps (accents, &, retours à la ligne)', () => {
    const url = new URL(lienDemande('contact@exemple.fr', demande));
    expect(url.searchParams.get('subject')).toBe('Demande sur mesure — Maison & Fils');
    const corps = url.searchParams.get('body') ?? '';
    expect(corps).toContain('Pièce : Vecteur');
    expect(corps).toContain('nous lançons une montre.');
    expect(corps.split('\n')[0]).toBe('Nom : Claire Martin');
  });

  it('prend le nom comme sujet si la maison est vide', () => {
    const url = new URL(lienDemande('a@b.fr', { ...demande, maison: '' }));
    expect(url.searchParams.get('subject')).toBe('Demande sur mesure — Claire Martin');
  });
});
