import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,       // also serve on the LAN, so a phone on the same wifi can reach it
    port: 5180,
    strictPort: true,
  },
})
