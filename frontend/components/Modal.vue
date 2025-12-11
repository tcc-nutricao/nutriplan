<template>
<teleport to="body">
<Transition
  name="modal"
  appear
  enter-from-class="opacity-0"
  leave-to-class="opacity-0"
  enter-active-class="transition-opacity duration-300 ease"
  leave-active-class="transition-opacity duration-300 ease"
>
  <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      @click.self="$emit('closeModal')"
    >
    <div class="bg-white py-6 px-7 rounded-xl shadow-xl max-w-md w-full modal-container transition-transform duration-300 ease">
      <h2 class="text-3xl text-center text-p-600 font-bold mb-4">{{ title ? title : '' }}</h2>
      <p class="mb-5 text-[#351F56] text-center text-xl">{{ content }}</p>
      <p v-if="text" class="mb-5 text-gray-500 text-center text-md">{{ text }}</p>

      <Flex gap-5>
        <Button outlined lightPurple label="Voltar" @click="close" class="w-full" />
        <Button mediumPurple :label="btnLabel" @click="$emit('confirm')" class="w-full" />
      </Flex>
    </div>
  </div>
</Transition>
</teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    title: String,
    content: String,
    text: String,
    btnLabel: { type: String, default: 'OK' }
})

const emits = defineEmits(['closeModal', 'confirm'])

const isOpen = ref(false)

const close = () => {
    emits('closeModal')
}
</script>
