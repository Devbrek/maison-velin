/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Vitest réutilise la config Vite d'Astro (plugins, alias…)
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
});
