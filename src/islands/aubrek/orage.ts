// Données de l'Orage passées par la page aux îlots, et calculs dérivés de la configuration
import type { Configuration } from './configuration';

export interface OptionsOrage {
  boitiers: { id: string; label: string; poids: string }[];
  bracelets: { id: string; label: string; teinte: string }[];
}

/** Boîtier et bracelet choisis (repli sur le premier si l'id est inconnu) */
export function choix(options: OptionsOrage, config: Configuration) {
  return {
    boitier: options.boitiers.find((b) => b.id === config.boitier) ?? options.boitiers[0],
    bracelet: options.bracelets.find((b) => b.id === config.bracelet) ?? options.bracelets[0],
  };
}

/** Résumé lisible : « Orage · 45 mm · Élastomère noir » */
export function resume(options: OptionsOrage, config: Configuration): string {
  const { boitier, bracelet } = choix(options, config);
  return `Orage · ${boitier.label} · ${bracelet.label}`;
}
