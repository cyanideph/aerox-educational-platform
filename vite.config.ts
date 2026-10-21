import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          prism: ['prismjs'],
        },
      },
    },
  },
  assetsInclude: ['**/*.glb', '**/*.ktx2', '**/*.hdr']
})