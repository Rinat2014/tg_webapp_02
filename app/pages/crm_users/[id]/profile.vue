<template>
<div>
   <h1 class="text-center text-4xl p-4 bg-green-200 text-green-700         dark:bg-green-700 dark:text-green-400">{{ id }}</h1>
   <div class="px-2 bg-">
      <ButtonBack />
      
      <div class="text-center text-black      dark:text-white">
        <div>Server: V1</div>
        
        <!-- oplata -->
        <div class="p-2 my-2 border rounded">
         <div class="pb-2 text-lg">2026</div>
         <div class="flex justify-between items-center text-gray-400">
            <div class="text-green-400">1</div>
            <div class="text-green-400">2</div>
            <div class="text-green-400">3</div>
            <div class="text-green-400">4</div>
            <div class="">5</div>
            <div class="">6</div>
            <div class="">7</div>
            <div class="">8</div>
            <div class="">9</div>
            <div class="">10</div>
            <div class="">11</div>
            <div class="">12</div>
         </div>
        </div>
   
        <!-- oplata -->
        <div class="p-2 my-2 border rounded">
         <div class="pb-2 text-lg">2025</div>
         <div class="flex justify-between items-center text-gray-400">
            <div class="">1</div>
            <div class="">2</div>
            <div class="">3</div>
            <div class="">4</div>
            <div class="">5</div>
            <div class="text-green-400">6</div>
            <div class="text-green-400">7</div>
            <div class="text-green-400">8</div>
            <div class="text-green-400">9</div>
            <div class="text-green-400">10</div>
            <div class="text-green-400">11</div>
            <div class="text-green-400">12</div>
         </div>
        </div>
        
      </div>
   </div>


</div>
</template>




















<script setup>
import ButtonBack from '~/components/ui/ButtonBack.vue';

const route = useRoute()
const { id } = useRoute().params
</script>