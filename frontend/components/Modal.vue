<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
    <div class="bg-white p-5 rounded-xl shadow-xl max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">{{ title ? title : '' }}</h2>
      <p class="mb-5 text-[#351F56] text-center text-xl">{{ content }}</p>

      <Flex gap-5>
        <Button outlined lightPurple label="Voltar" @click="close" class="w-full" />
        <Button mediumPurple label="OK" @click="close" class="w-full" />
      </Flex>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    title: String,
    content: String
})

const emits = defineEmits(['closeModal'])

const isOpen = ref(false)

const close = () => {
    emits('closeModal')
}
</script>

