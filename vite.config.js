import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to all addresses (0.0.0.0) to allow external devices to connect.
    host: '0.0.0.0', 
    // Optionally, set the port you want to use.
    port: 5173,
  }
})
