import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // ssr: false,

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      // hmr: {
      //   clientPort: 443, // Для работы с HTTPS-туннелем ngrok
      // },
      // host: true, // внешний доступ
      allowedHosts: ['.ngrok-free.app'], // ngrok
    }
  },
})
