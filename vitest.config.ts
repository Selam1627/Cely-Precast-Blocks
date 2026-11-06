import { fileURLToPath } from 'node:url'

import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.spec.ts'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // Type-level tests (*.test-d.ts) check that invalid content is rejected
      // by TypeScript. vue-tsc is needed because the project imports .vue files.
      typecheck: {
        enabled: true,
        checker: 'vue-tsc',
        include: ['tests/**/*.test-d.ts'],
        tsconfig: './tsconfig.vitest.json',
      },
    },
  }),
)
