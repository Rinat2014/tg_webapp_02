import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  runtimeConfig: {
    public: {
      tg_bot_token: process.env.NUXT_PUBLIC_TELEGRAM_BOT_TOKEN,
      // apiBaseUrl: process.env.NUXT_PUBLIC_API_URL || '',
    }
  },

  app: {
    head: {
      script: [
        {
          src: 'https://telegram.org/js/telegram-web-app.js?56', // подключаем в header скрипты для работы с twa
          async: true,
          defer: true
        }
      ]
    }
  },

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      // allowedHosts: ['.ngrok-free.app'], // ngrok testing
    }
  },

  // Vercel
  nitro: {
    preset: 'vercel'
  },

  ssr: false,  // SPA

  app: {
    baseURL: '/',  
    buildAssetsDir: '/_nuxt/',
    cdnURL: ''
  }
})
