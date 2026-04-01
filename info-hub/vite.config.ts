import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { localDocsPlugin } from './vite.config.plugin'

export default defineConfig({
  plugins: [react(), localDocsPlugin()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3005,
    host: '127.0.0.1',
    allowedHosts: ['docs', 'localhost', '127.0.0.1', 'axiomaticworld.com'],
  },
  preview: {
    port: 3005,
    host: '127.0.0.1',
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
