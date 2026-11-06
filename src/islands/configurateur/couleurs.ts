import type { Accent, Ambiance, Police } from './types';

/**
 * Variables CSS de l'aperçu pour un réglage donné.
 * L'aperçu ne lit que ces variables : changer de réglage = changer ces valeurs.
 */
export function variablesApercu(accent: Accent, police: Police, ambiance: Ambiance): Record<string, string> {
  const { fond, encre, secondaire, surface } = ambiance.couleurs;
  return {
    '--p-fond': fond,
    '--p-encre': encre,
    '--p-secondaire': secondaire,
    '--p-surface': surface ?? fond,
    '--p-ligne': `color-mix(in srgb, ${encre} 16%, transparent)`,
    // L'accent change de version selon le fond, pour rester lisible
    '--p-accent': ambiance.sombre ? accent.sombre : accent.clair,
    // Le texte posé sur l'accent reprend la couleur du fond
    '--p-sur-accent': fond,
    '--p-police': `var(${police.police})`,
  };
}

/** Résumé lisible du réglage, annoncé aux lecteurs d'écran */
export function resumeReglage(accent: Accent, police: Police, ambiance: Ambiance): string {
  return `${accent.label} · ${police.label} · ${ambiance.label}`;
}
