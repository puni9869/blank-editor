import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  base: '/blank-editor/',
  plugins: [visualizer({ open: false })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'docs',
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
