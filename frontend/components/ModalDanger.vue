<template>
  <teleport to="body">
    <Transition name="modal" appear enter-from-class="opacity-0" leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-300 ease"
      leave-active-class="transition-opacity duration-300 ease">
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
        @click.self="$emit('closeModal')">
        <div
          class="bg-white px-7 py-6 rounded-2xl shadow-xl max-w-md w-full modal-container transition-transform duration-300 ease">
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
  btnLabel: String,
  confirm: {
    type: String,
    default: 'confirm'
  }
})

const emits = defineEmits(['closeModal', 'confirm'])

const close = () => {
  emits('closeModal')
}

const confirm = () => {
  emits(props.confirm)
  close();
}
</script>
