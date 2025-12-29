<template>
  <div v-if="initData" class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
    <!-- Аватар пользователя -->
    <div class="flex-shrink-0">
      <div 
        v-if="initData.user.photoUrl"
        class="w-12 h-12 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700"
      >
        <img 
          :src="initData.user.photoUrl" 
          :alt="initData.user.username || 'User'"
          class="w-full h-full object-cover"
        />
      </div>
      <div 
        v-else
        class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold"
      >
        {{ getAvatarFallback(initData.user) }}
      </div>
    </div>

    <!-- Информация о пользователе -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
        {{ initData.user.firstName }}
        {{ initData.user.lastName || '' }}
      </p>
      
      <p 
        v-if="initData.user.username"
        class="text-sm text-gray-500 dark:text-gray-400 truncate"
      >
        @{{ initData.user.username }}
      </p>
      
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
        ID: {{ initData.user.id }}
      </p>
    </div>
  </div>

  <div v-else class="text-center p-4 text-gray-500 dark:text-gray-400">
    Информация о пользователе недоступна 888888888888
  </div>
</template>






























<script setup>
import { useTelegram } from '~/composables/useTelegram';

const { initData, getAvatarFallback } = useTelegram();
</script>