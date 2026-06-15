import {defineConfig} from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['sanity', 'sanity/structure', '@sanity/vision', '@sanity/code-input', 'sanity/presentation'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  resolve: {
    alias: {},
  },
  ssr: {
    external: ['sanity'],
  },
})
