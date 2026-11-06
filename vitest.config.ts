/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Vitest réutilise la config Vite d'Astro (plugins, alias…)
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // Pas d'échec tant qu'aucun test n'existe (les premiers arrivent en phase 4)
    passWithNoTests: true,
  },
});
