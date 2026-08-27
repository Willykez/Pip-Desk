import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pip-desk/', // must match your GitHub repo name exactly
  server: {
    port: 5173
  }
})
