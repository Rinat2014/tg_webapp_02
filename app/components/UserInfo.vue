<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-sm w-full bg-white rounded-xl shadow-md p-6">
      <!-- Аватар -->
      <div class="flex justify-center mb-6">
        <div class="relative">
          <img 
            v-if="userData?.photo_url"
            :src="userData.photo_url" 
            :alt="userData.username || 'User'"
            class="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
          <div 
            v-else
            class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold"
          >
            {{ userInitials }}
          </div>
        </div>
      </div>

      <!-- ID -->
      <div class="mb-4 text-center">
        <p class="text-sm text-gray-500 mb-1">Telegram ID</p>
        <p class="text-lg font-mono font-bold text-gray-800">{{ userData?.id || 'Не указан' }}</p>
      </div>

      <!-- Username -->
      <div class="text-center">
        <p class="text-sm text-gray-500 mb-1">Username</p>
        <p class="text-xl font-semibold text-gray-800">
          {{ userData?.username ? `@${userData.username}` : 'Не указан' }}
        </p>
      </div>

      <!-- Отладка -->
      <div v-if="!userData && loading" class="mt-6 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-500">Загрузка данных...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const userData = ref(null)
const loading = ref(true)

// Получаем инициалы для аватара
const userInitials = computed(() => {
  if (!userData.value?.first_name) return 'TG'
  return userData.value.first_name.charAt(0).toUpperCase()
})

// Функция для получения данных
const getTelegramData = () => {
  if (typeof window === 'undefined') {
    loading.value = false
    return
  }

  // Проверяем Telegram WebApp
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    
    // Инициализируем
    tg.ready()
    tg.expand()
    
    // Получаем данные
    const user = tg.initDataUnsafe?.user
    if (user) {
      userData.value = {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        photo_url: user.photo_url
      }
      console.log('Данные Telegram:', userData.value)
    }
  } else {
    console.log('Запущено вне Telegram')
  }
  
  loading.value = false
}

onMounted(() => {
  getTelegramData()
})
</script>