import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Completely relative links work on every device, custom domain, or subfolder!
  server: {
    host: true,
    port: 5173
  }
})
