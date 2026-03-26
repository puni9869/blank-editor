import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  publicDir: 'assets',
  plugins: [visualizer({ open: false })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./frontend', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      treeshake: 'safest',
      output: {
        inlineDynamicImports: false,
      },
    },

    terserOptions: {
      compress: {
        dead_code: true,
        drop_console: true,
        arrows: true,
      },
      mangle: true,
    },

    minify: 'terser',
    cssMinify: 'lightningcss',
  },
});
