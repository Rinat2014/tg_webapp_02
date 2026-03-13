<template>
<div>
   <h1 class="text-center text-4xl p-4 bg-indigo-200 text-indigo-700">404 not found</h1>
   <div class="text-center text-8xl py-8 my-8 ">🤷‍♂️</div>
   <div class="dark:text-white">{{ currentFullPath }}</div>
   <!-- <UsersCRM /> -->
</div>
</template>



<script setup>
const route = useRoute()
const currentFullPath = computed(() => route.fullPath)

// Или напрямую через computed
// const id = computed(() => route.params.id)
</script>