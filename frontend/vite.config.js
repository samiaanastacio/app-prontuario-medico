// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist',
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Define a base URL para o projeto
  build: {
    outDir: 'dist', // Define o diretório de saída para o build
    manifest: true, // Gera um manifesto de build
  },
  plugins: [react()],
})