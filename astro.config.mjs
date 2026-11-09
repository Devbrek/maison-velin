// @ts-check
import { defineConfig, fontProviders, sharpImageService } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

const fontsource = fontProviders.fontsource();

// https://astro.build/config
export default defineConfig({
  // Adresse publique (sert au sitemap, aux URL canoniques et aux images Open Graph)
  site: 'https://maison-velin.vercel.app',

  integrations: [
    react(),
    // La page 404 et les images Open Graph ne vont pas dans le sitemap
    sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/og/') }),
  ],

  // Qualité par défaut des photos, par format (AVIF 55 ≈ JPEG 80 à l'œil, pour moitié moins de poids)
  image: {
    service: sharpImageService({
      avif: { quality: 55 },
      webp: { quality: 75 },
      jpeg: { quality: 80, mozjpeg: true },
    }),
  },

  vite: {
    plugins: [tailwindcss()]
  },

  // Polices auto-hébergées : déclarées ici, chargées page par page avec <Font cssVariable="…" />.
  // Sous-ensemble latin (par défaut). Graisses listées une par une = fichiers statiques légers ;
  // une plage ("300 600") = fichier variable, gardé seulement quand il reste léger (≤ 52 Ko).
  fonts: [
    // Maison Vélin : Newsreader pour les titres, Jost pour le texte
    { provider: fontsource, name: 'Newsreader', cssVariable: '--font-newsreader', weights: [400], styles: ['normal', 'italic'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Jost', cssVariable: '--font-jost', weights: ['300 500'], styles: ['normal'] },

    // Aubrek / Vecteur
    { provider: fontsource, name: 'Saira', cssVariable: '--font-saira', weights: [300, 400, 500, 600], styles: ['normal', 'italic'] },

    // Calade / Lavis
    { provider: fontsource, name: 'Fraunces', cssVariable: '--font-fraunces', weights: [300, 400], styles: ['normal', 'italic'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Manrope', cssVariable: '--font-manrope', weights: ['300 600'], styles: ['normal'] },

    // Sertelle / Filigrane (Bodoni : nom de la pièce Filigrane et choix du configurateur)
    { provider: fontsource, name: 'Bodoni Moda', cssVariable: '--font-bodoni', weights: [400], styles: ['normal', 'italic'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Cormorant Garamond', cssVariable: '--font-cormorant', weights: ['300 500'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Hanken Grotesk', cssVariable: '--font-hanken', weights: ['300 600'], styles: ['normal'] },

    // Polices proposées uniquement dans les configurateurs des fiches pièces
    { provider: fontsource, name: 'EB Garamond', cssVariable: '--font-eb-garamond', weights: [400], styles: ['normal', 'italic'], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Playfair Display', cssVariable: '--font-playfair', weights: [400], fallbacks: ['serif'] },
    { provider: fontsource, name: 'Exo 2', cssVariable: '--font-exo2', weights: ['300 600'] },
    { provider: fontsource, name: 'Titillium Web', cssVariable: '--font-titillium', weights: [300, 400, 600] },
  ],
});