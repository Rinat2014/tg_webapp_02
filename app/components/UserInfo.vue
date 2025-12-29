<template>
  <div class="flex items-center gap-3 p-4 bg-white rounded-lg shadow">
    <!-- Аватар -->
    <div class="relative">
      <img 
        v-if="userPhoto"
        :src="userPhoto"
        alt="Avatar"
        class="w-12 h-12 rounded-full"
      />
      <div 
        v-else
        class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center"
      >
        <span class="text-gray-600 font-medium">
          {{ userInitials }}
        </span>
      </div>
    </div>

    <!-- Информация о пользователе -->
    <div class="flex flex-col">
      <span class="font-semibold text-gray-900">
        {{ userName || 'Пользователь' }}
      </span>
      <span class="text-sm text-gray-500">
        ID: {{ userId || 'Не указан' }}
      </span>
    </div>
  </div>
</template>






































<script setup>
import { ref, onMounted, computed } from 'vue'



const userId = ref('')
const userName = ref('')
const userPhoto = ref('')

const userInitials = computed(() => {
  if (!userName.value) return '?'
  return userName.value.charAt(0).toUpperCase()
})

onMounted(() => {
  // Проверяем, что мы в Telegram WebApp
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    const user = tg.initDataUnsafe?.user
    
    if (user) {
      userId.value = user.id
      userName.value = user.username || `${user.first_name} ${user.last_name || ''}`.trim()
      userPhoto.value = user.photo_url
    }
  }
})
</script>