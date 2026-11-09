// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

const fontsource = fontProviders.fontsource();

// https://astro.build/config
export default defineConfig({
  // Domaine provisoire, à confirmer en phase 9 (sert au sitemap, aux URL canoniques et aux images Open Graph)
  site: 'https://velin.devbrek.fr',

  integrations: [
    react(),
    // La page 404 et les images Open Graph ne vont pas dans le sitemap
    sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/og/') }),
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  // Polices auto-hébergées : déclarées ici, chargées page par page avec <Font cssVariable="…" />
  fonts: [
    // Maison Vélin : Newsreader pour les titres, Jost pour le texte
    { provider: fontsource, name: 'Newsreader', cssVariable: '--font-newsreader', weights: [400], styles: ['normal', 'italic'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Jost', cssVariable: '--font-jost', weights: ['300 500'], styles: ['normal'] },

    // Aubrek / Vecteur
    { provider: fontsource, name: 'Saira', cssVariable: '--font-saira', weights: ['300 600'] },

    // Calade / Lavis
    { provider: fontsource, name: 'Fraunces', cssVariable: '--font-fraunces', weights: ['300 600'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Manrope', cssVariable: '--font-manrope', weights: ['300 600'], styles: ['normal'] },

    // Sertelle / Filigrane (Bodoni : nom de la pièce Filigrane et choix du configurateur)
    { provider: fontsource, name: 'Bodoni Moda', cssVariable: '--font-bodoni', weights: ['400 700'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Cormorant Garamond', cssVariable: '--font-cormorant', weights: ['300 500'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Hanken Grotesk', cssVariable: '--font-hanken', weights: ['300 600'], styles: ['normal'] },

    // Polices proposées uniquement dans les configurateurs des fiches pièces
    { provider: fontsource, name: 'EB Garamond', cssVariable: '--font-eb-garamond', weights: ['400 500'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Playfair Display', cssVariable: '--font-playfair', weights: [400], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Exo 2', cssVariable: '--font-exo2', weights: ['300 600'] },
    { provider: fontsource, name: 'Titillium Web', cssVariable: '--font-titillium', weights: [300, 400, 600] },
  ],
});