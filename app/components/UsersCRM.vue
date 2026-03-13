<template>
  <div class="flex items-center justify-center p-4 dark:bg-gray-800 bg-white">
    <div class="w-full">

      <div class="p-2 mb-4 bg-blue-300/10 rounded shadow-md     flex items-center justify-between">
        <div class="w-6 text-center cursor-pointer"><</div>
        <div class="dark:text-white text-center text-xl">Adminka (2026)</div>
        <div class="w-6 text-center cursor-pointer">></div>
      </div>




      <div 
        class="w-full my-2 cursor-pointer    hover:bg-black/10 dark:hover:bg-black/20 dark:bg-black/50 border dark:border-gray-200 dark:text-gray-100 rounded transition"
        v-for="(userClient, index) in clients" :key="userClient">

        <div class="text-sm text-center text-gray-400 dark:text-gray-700">{{ index }}</div>
        <div class="px-2">
          <NuxtLink :to="`/crm_users/${userClient.username}/profile`">
            
            <div class="flex items-center justify-between">
              <div class="text-xl text-gray-800 dark:text-gray-200">
                {{ userClient.username }} 
              </div>
              
              <div>{{ userClient.server }}</div>
            </div>
            <div class="flex items-center justify-between">
              <!-- <svg class="size-4 fill-green-500" 
                xmlns="http://www.w3.org/2000/svg"
                v-for="month in userClient.oplata"><rect width="100" height="100" /></svg> -->
              
              <div
                v-for="(month, N) in userClient.oplata" >
                <p 
                  class="text-xs w-5 text-center"
                  :class="{'text-green-400 rounded-full' : month }">
                  *
                </p>
                <!-- <p class="text-green-500 bg-green-500/30">{{ month }}</p> -->
              </div>

              <!-- <svg class="size-4 fill-green-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              <svg class="size-4 fill-green-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              <svg class="size-4 fill-green-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              |
              <svg class="size-4 fill-green-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              <svg class="size-4 fill-green-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              <svg class="size-4 fill-green-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              |
              <svg class="size-4 fill-gray-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              <svg class="size-4 fill-gray-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              <svg class="size-4 fill-gray-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              |
              <svg class="size-4 fill-gray-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              <svg class="size-4 fill-gray-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>
              <svg class="size-4 fill-gray-500" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg> -->

            </div>
          </NuxtLink>
          
          
          <!-- oplata -->
          <!-- <div class="flex text-sm justify-between items-center">
            <div               
              v-for="(mes, index) in userClient.oplata">
              <div 
                class="cursor-pointer" 
                
                :class="{
                  'text-gray-500': mes == false,
                  'text-green-500': mes == true,
                  'font-bold text-xl': index == currentMonth,
                }"
                >
                {{ index }}
              </div>
            </div>
          </div> -->

        </div>
      </div>


      
      <!-- Кнопки сохранения -->
      <!-- <div class="grid grid-cols-1 gap-2 my-4">
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
        
       
      </div> -->

      




      






      <!-- Сообщение об ошибке -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <!-- Отладка -->
      <div v-if="!userData && loading" class="mt-6 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-500">Загрузка данных...</p>
      </div>
      
      <!-- <div class="bg-black text-white text-sm">
        {{selectedFeelsPositive}}
        <div class="border"></div>
        {{selectedFeelsNegative}}
      </div> -->

      

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


// переменные для аккордиона
const isPositiveOpen = ref(false)
const isNegativeOpen = ref(false)
const selectedFeelsPositive = ref([])
const selectedFeelsNegative = ref([])

// const PositiveMap = ['Азарт', 'Антиципация', 'Безмятежность', 'Безопасность', 'Благодарность', 'Блаженство', 'Вдохновение', 'Вера', 'Верность', 'Взаимовыручка', 'Влечение', 'Возбуждение', 'Воодушевление', 'Восхищение', 'Восторг', 'Гармония', 'Гордость', 'Доверие', 'Довольство', 'Доброта', 'Дружелюбие', 'Жизнерадостность', 'Жизнелюбие', 'Забота', 'Защищенность', 'Здравомыслие', 'Искренность', 'Комфорт', 'Кураж', 'Любовь', 'Любовь к себе', 'Надежда', 'Нежность', 'Одобрение', 'Одухотворенность', 'Оживление', 'Озарение', 'Окрыленность', 'Оптимизм', 'Освобождение', 'Очарованность', 'Привязанность', 'Признательность', 'Принятие', 'Приподнятость', 'Прозрение', 'Радость', 'Самодовольство', 'Самоценность', 'Симпатия', 'Сопереживание', 'Сопричастность', 'Спокойствие', 'Счастье', 'Теплота', 'Триумф', 'Уверенность', 'Увлеченность', 'Удовлетворение', 'Удовольствие', 'Умиротворение', 'Уравновешенность', 'Уважение', 'Энтузиазм', 'Экстаз' ]
// const NePositiveMap = ['Апатия', 'Безвыходность', 'Безразличие', 'Безысходность', 'Беспомощность', 'Бессилие', 'Бешенство', 'Боязнь', 'Вина', 'Враждебность', 'Вредность', 'Высокомерие', 'Гнев', 'Горе', 'Горечь', 'Грусть', 'Досада', 'Душевная боль', 'Заброшенность', 'Зависть', 'Загнанность', 'Замешательство', 'Застенчивость', 'Злость', 'Изнеможение', 'Изоляция', 'Истерия', 'Испуг', 'Истощение', 'Лень', 'Меланхолия', 'Муки', 'Надменность', 'Недовольство', 'Ненависть', 'Неловкость', 'Неопределённость', 'Неприязнь', 'Неполноценность', 'Неуверенность', 'Нервозность', 'Ностальгия', 'Обида', 'Огорчение', 'Одиночество', 'Омерзение', 'Опасение', 'Отвращение', 'Отчаяние', 'Отчуждение', 'Отчуждённость', 'Оцепенение', 'Ошарашенность', 'Ошеломлённость', 'Паника', 'Печаль', 'Подавленность', 'Покинутость', 'Презрение', 'Презрение к себе', 'Пренебрежение', 'Разбитость', 'Раздвоение', 'Раздражение', 'Разочарование', 'Равнодушие', 'Раскаяние', 'Растерянность', 'Ревность', 'Робость', 'Скука', 'Сломленность', 'Смущение', 'Смятение', 'Собственничество', 'Сожаление', 'Сомнение', 'Скорбь', 'Страдание', 'Страх', 'Стыд', 'Терзания', 'Томление', 'Тоска', 'Тревога', 'Угнетенность', 'Угрызения совести', 'Удрученность', 'Унижение', 'Уныние', 'Упадок духа', 'Усталость', 'Ужас', 'Уязвлённость', 'Холодность', 'Ярость' ]


const currentMonth = 3











const clients = ref([
  {
    username: "Namaskar",
    server: "V1",
    oplata: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "Madagaskar",
    server: "V1",
    oplata: {
      1: true,
      2: true,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "Mantresh",
    server: "V2",
    oplata: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "Satya",
    server: "V2",
    oplata: {
      1: true,
      2: true,
      3: true,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "Vidya",
    server: "V3",
    oplata: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "User",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: true,
      4: true,
      5: true,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "Andrey",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: true,
      8: true,
      9: true,
      10: true,
      11: false,
      12: false,
    },
  },
  {
    username: "Vasya",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: true,
      11: true,
      12: true,
    },
  },
  {
    username: "Natali",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: true,
      8: true,
      9: true,
      10: true,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  },
  {
    username: "username-6",
    server: "V3",
    oplata: {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    },
  }
])







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
        text: text,
        parse_mode: 'Markdown'
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

    let messageText = ''
    
    if (selectedFeelsPositive.value.length > 0) {
      messageText += '\n\n🟢🟢🟢\n **Позитивные чувства:**'
      selectedFeelsPositive.value.forEach(feeling => {
        messageText += `\n  ${feeling}`
      })
    }
    
    if (selectedFeelsNegative.value.length > 0) {
      messageText += '\n\n🔴🔴🔴\n **Не позитивные чувства:**'
      selectedFeelsNegative.value.forEach(feeling => {
        messageText += `\n  ${feeling}`
      })
    }

    await sendMessageToChat(messageText)
    
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
    await sendMessageToChat('Отмена')
    
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