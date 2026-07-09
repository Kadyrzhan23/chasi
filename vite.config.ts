import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true, // слушать на всех интерфейсах — доступ с телефона по сети
    port: 5173,
  },
})
