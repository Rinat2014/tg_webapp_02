<template>
  <button @click="goBack" class="p-2 my-1 w-full border rounded cursor-pointer text-black hover:bg-blue-500/10       dark:text-white dark:hover:bg-black/20">
    ← Назад
  </button>
</template>



<script setup>



const router = useRouter();

const goBack = () => {
  // Проверяем историю навигации
  if (window.history.length > 2) {
    router.back();
  } else {
    // Если истории мало, переходим на главную
    router.push('/');
  }
};
</script>