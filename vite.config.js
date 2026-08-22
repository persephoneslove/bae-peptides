import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/bae-peptides/',
  server: {
    host: true,
    port: 5173
  }
})
