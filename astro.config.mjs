// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const fontsource = fontProviders.fontsource();

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  // Polices auto-hébergées : déclarées ici, chargées page par page avec <Font cssVariable="…" />
  fonts: [
    // Maison Vélin
    { provider: fontsource, name: 'Bodoni Moda', cssVariable: '--font-bodoni', weights: ['400 700'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Jost', cssVariable: '--font-jost', weights: ['300 500'], styles: ['normal'] },

    // Aubrek / Vecteur
    { provider: fontsource, name: 'Saira', cssVariable: '--font-saira', weights: ['300 600'] },

    // Calade / Lavis
    { provider: fontsource, name: 'Fraunces', cssVariable: '--font-fraunces', weights: ['300 600'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Manrope', cssVariable: '--font-manrope', weights: ['300 600'], styles: ['normal'] },

    // Sertelle / Filigrane
    { provider: fontsource, name: 'Cormorant Garamond', cssVariable: '--font-cormorant', weights: ['300 500'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Hanken Grotesk', cssVariable: '--font-hanken', weights: ['300 600'], styles: ['normal'] },

    // Polices proposées uniquement dans les configurateurs des fiches pièces
    { provider: fontsource, name: 'EB Garamond', cssVariable: '--font-eb-garamond', weights: ['400 500'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Playfair Display', cssVariable: '--font-playfair', weights: [400], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Exo 2', cssVariable: '--font-exo2', weights: ['300 600'] },
    { provider: fontsource, name: 'Titillium Web', cssVariable: '--font-titillium', weights: [300, 400, 600] },
  ],
});
