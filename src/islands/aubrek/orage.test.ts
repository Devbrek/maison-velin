import { describe, expect, it } from 'vitest';
import { choix, resume, type OptionsOrage } from './orage';

const options: OptionsOrage = {
  boitiers: [
    { id: '41', label: '41 mm', poids: '32 g' },
    { id: '45', label: '45 mm', poids: '38 g' },
  ],
  bracelets: [
    { id: 'elastomere', label: 'Élastomère noir', teinte: '#141416' },
    { id: 'cuir', label: 'Cuir nuit', teinte: '#2B2730' },
  ],
};

describe('configuration Orage', () => {
  it('retrouve le boîtier et le bracelet choisis', () => {
    const { boitier, bracelet } = choix(options, { boitier: '41', bracelet: 'cuir' });
    expect(boitier.poids).toBe('32 g');
    expect(bracelet.label).toBe('Cuir nuit');
  });

  it('se rabat sur la première option si un id est inconnu', () => {
    expect(choix(options, { boitier: '99', bracelet: '?' }).boitier.id).toBe('41');
  });

  it('résume la configuration', () => {
    expect(resume(options, { boitier: '45', bracelet: 'elastomere' })).toBe('Orage · 45 mm · Élastomère noir');
  });
});
