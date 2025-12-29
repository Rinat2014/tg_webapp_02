<template>
<div>
  <!-- <h1 class="bg-sky-100 text-3xl text-center uppercase p-4">index page</h1> -->

   <UserInfo />
</div>
</template>






<script setup>
useHead({
  script: [
    {
      src: 'https://telegram.org/js/telegram-web-app.js?56',
      async: true,
      defer: true
    }
  ]
})
</script>