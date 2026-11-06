/*
 * Configuration de l'Orage, partagée entre plusieurs îlots de la même page
 * (configurateur, bande de caractéristiques, fiche technique).
 * Un module JS n'est chargé qu'une fois : tous les îlots lisent donc le même état.
 * C'est le principe des « stores » (comme nanostores, conseillé par la doc d'Astro), en 20 lignes.
 */
import { useSyncExternalStore } from 'react';

export interface Configuration {
  boitier: string; // id du boîtier, ex. « 45 »
  bracelet: string; // id du bracelet, ex. « elastomere »
}

let etat: Configuration = { boitier: '45', bracelet: 'elastomere' };
const abonnes = new Set<() => void>();

export function changerConfiguration(partiel: Partial<Configuration>) {
  etat = { ...etat, ...partiel };
  abonnes.forEach((prevenir) => prevenir());
}

function sAbonner(prevenir: () => void) {
  abonnes.add(prevenir);
  return () => abonnes.delete(prevenir);
}

/** Hook React : le composant se met à jour quand la configuration change */
export function useConfiguration(): Configuration {
  return useSyncExternalStore(
    sAbonner,
    () => etat,
    () => etat,
  );
}
