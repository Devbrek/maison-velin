// Données passées par la page Astro à l'îlot configurateur (sérialisables en JSON)

export type PieceId = 'filigrane' | 'vecteur' | 'lavis';

export interface Accent {
  id: string;
  label: string;
  clair: string; // pour fond clair
  sombre: string; // pour fond sombre
}

export interface Police {
  id: string;
  label: string;
  police: string; // variable CSS, ex. --font-saira
  note: string;
}

export interface Ambiance {
  id: string;
  label: string;
  sombre: boolean;
  couleurs: { fond: string; encre: string; secondaire: string; surface?: string };
  image: { src: string; position: string };
}

export interface ApercuProps {
  ambiances: Ambiance[];
  ambianceId: string;
}
