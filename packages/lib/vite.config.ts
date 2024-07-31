/// <reference types='vitest' />

// Import using workspace - breaks if you didn't build it before, and because on a fresh state you will not have it build, it will always fails
import { myDebugPlugin } from '@repro/vite-plugins';
// Import using ts path aliases - also breaks because the vite resolve is not linked to the global tsconfig file, and thus to the aliases
// import { myDebugPlugin } from 'vite-plugins-using-paths-aliases';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  plugins: [nxViteTsPaths(), myDebugPlugin()],

  build: {
    outDir: './dist',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'third-party-providers',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
}));
