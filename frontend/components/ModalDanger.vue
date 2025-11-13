<template>
<teleport to="body">
<Transition name="modal" appear>
  <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      @click.self="$emit('closeModal')"
    >
    <div class="bg-white px-7 py-6 rounded-2xl shadow-xl max-w-md w-full">
      <h2 class="font-semibold mb-4 text-center text-danger text-3xl">{{ title ? title : '' }}</h2>
      <p class="mb-5 text-[#351F56] text-center text-xl">{{ content }}</p>

      <Flex gap-5>
        <Button outlined gray label="Cancelar" @click="close" class="w-full" />
        <Button red :label="btnLabel" @click="confirm" class="w-full" />
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
    btnLabel: String
})

const emits = defineEmits(['closeModal', 'confirm'])

const isOpen = ref(false)

const close = () => {
    emits('closeModal')
}

const confirm = () => {
    emits('confirm')
    close();
}
</script>

<style>
.modal-enter-from {
opacity: 0;
}
.modal-enter-from .modal-container {
transform: scale(0.9);
}

.modal-leave-to {
opacity: 0;
}
.modal-leave-to .modal-container {
transform: scale(0.9);
}

.modal-enter-active,
.modal-leave-active {
transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
transition: transform 0.3s ease;
}
</style>

