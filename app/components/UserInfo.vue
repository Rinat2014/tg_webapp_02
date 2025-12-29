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
      <div class="text-center mb-6">
        <p class="text-sm text-gray-500 mb-1">Username</p>
        <p class="text-xl font-semibold text-gray-800">
          {{ userData?.username ? `@${userData.username}` : 'Не указан' }}
        </p>
      </div>

      <!-- Кнопки -->
      <div class="grid grid-cols-2 gap-3 mt-8">
        <button
          @click="saveAction"
          :disabled="sending"
          class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <span v-if="!sending">Save</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        </button>
        
        <button
          @click="cancelAction"
          :disabled="sending"
          class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          Cancel
        </button>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {{ errorMessage }}
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

const runtimeConfig = useRuntimeConfig()
const userData = ref(null)
const loading = ref(true)
const sending = ref(false)
const errorMessage = ref('')

// Получаем инициалы для аватара
const userInitials = computed(() => {
  if (!userData.value?.first_name) return 'TG'
  return userData.value.first_name.charAt(0).toUpperCase()
})

// Функция для получения данных из Telegram WebApp
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
    
    // Получаем данные пользователя
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
    errorMessage.value = 'Приложение запущено вне Telegram'
  }
  
  loading.value = false
}

// Функция для отправки сообщения в чат
const sendMessageToChat = async (text) => {
  try {
    const tg = window.Telegram?.WebApp
    if (!tg) {
      throw new Error('Telegram WebApp не доступен')
    }

    // Получаем ID пользователя/чата
    const initData = tg.initDataUnsafe
    let chatId = initData?.user?.id
    
    // Если нет user.id, пытаемся получить chat.id
    if (!chatId) {
      chatId = initData?.chat?.id
    }
    
    if (!chatId) {
      throw new Error('Не удалось получить chat_id')
    }

    // Получаем токен бота из runtimeConfig
    const botToken = runtimeConfig.public.tg_bot_token
    
    if (!botToken) {
      throw new Error('Токен бота не настроен')
    }

    console.log('Отправка сообщения:', { chatId, text, botToken: botToken ? 'установлен' : 'отсутствует' })

    // Отправляем сообщение через Telegram Bot API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    })

    const result = await response.json()
    
    if (!result.ok) {
      console.error('Ошибка Telegram API:', result)
      throw new Error(result.description || 'Ошибка отправки сообщения')
    }

    console.log('Сообщение отправлено успешно:', result)
    return result
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error)
    throw error
  }
}

// Действие кнопки Save
const saveAction = async () => {
  if (sending.value) return
  
  sending.value = true
  errorMessage.value = ''
  
  try {
    await sendMessageToChat('save')
    
    // Закрываем WebApp после успешной отправки
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.close()
    }
  } catch (error) {
    errorMessage.value = `Ошибка: ${error.message}`
    console.error('Save error:', error)
  } finally {
    sending.value = false
  }
}

// Действие кнопки Cancel
const cancelAction = async () => {
  if (sending.value) return
  
  sending.value = true
  errorMessage.value = ''
  
  try {
    await sendMessageToChat('cancel')
    
    // Закрываем WebApp после успешной отправки
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.close()
    }
  } catch (error) {
    errorMessage.value = `Ошибка: ${error.message}`
    console.error('Cancel error:', error)
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  getTelegramData()
})
</script>