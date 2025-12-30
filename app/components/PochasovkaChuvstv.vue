<template>
  <div class="flex items-center justify-center p-4">
    <div class="w-full  ">

      <div class="flex justify-start items-center gap-2 bg-blue-300/10 p-2 rounded-xl shadow-md">
        <!-- Аватар -->
        <div class="flex justify-center">
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
  
        <!-- Username + ID -->
        <div class="">          
          <p class="text-xl font-semibold text-gray-800">{{ userData?.username ? `@${userData.username}` : 'UserName' }}</p>
          <p class="font-mono text-gray-500">{{ userData?.id ? `ID: ${userData?.id}` : 'Telegram ID' }}</p>
        </div>
  
        

      </div>


      
      <!-- Кнопки сохранения и отмены -->
      <div class="grid grid-cols-2 gap-3 my-4">
        <button
          @click="saveAction"
          :disabled="saving"
          class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <span v-if="!saving">Сохранить</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-2"        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Сохраняем...
          </span>
        </button>
        
        <button
          @click="cancelAction"
          :disabled="canceling"
          class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <span v-if="!saving">Отменить</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-2"        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Отменяем...
          </span>
          
        </button>
      </div>

      <!-- Выпадающий список -->
      <div class="w-full px-2">

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
const botToken = runtimeConfig.public.tg_bot_token

const userData = ref(null)
const loading = ref(true)
// const sending = ref(false)
const saving = ref(false)
const canceling = ref(false)
const errorMessage = ref('')



// Получаем инициалы для аватара (если не установлено фото)
const userInitials = computed(() => {
  if (!userData.value?.first_name) return 'TG'
  return userData.value.first_name.charAt(0).toUpperCase()
})

// Получение данных из Telegram WebApp
const getTelegramData = () => {
  // if (typeof window === 'undefined') {
  //   loading.value = false
  //   return
  // }

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
      // console.log('Данные Telegram:', userData.value)
    }
  } else {
    // console.log('Запущено вне Telegram')
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

    
    if (!botToken) {
      throw new Error('Токен бота не настроен')
    }

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
      // console.error('Ошибка Telegram API:', result)
      throw new Error(result.description || 'Ошибка отправки сообщения')
    }

    return result
  } catch (error) {
    // console.error('Ошибка отправки сообщения:', error)
    throw error
  }
}


// Действие кнопки Save
const saveAction = async () => {
  if (saving.value) return
  
  saving.value = true
  errorMessage.value = ''
  
  try {
    await sendMessageToChat('save')
    
    // Закрываем WebApp после успешной отправки
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.close()
    }
  } catch (error) {
    errorMessage.value = `❗️ Error: ${error.message}`
    // console.error('Save error:', error)
  } finally {
    saving.value = false
  }
}


// Действие кнопки Cancel
const cancelAction = async () => {
  if (canceling.value) return
  
  canceling.value = true
  errorMessage.value = ''
  
  try {
    await sendMessageToChat('cancel')
    
    // Закрываем WebApp после успешной отправки
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.close()
    }
  } catch (error) {
    errorMessage.value = `❗️ Error: ${error.message}`
    // console.error('Cancel error:', error)
  } finally {
    canceling.value = false
  }
}


onMounted(() => {
  getTelegramData()
})


</script>