<template>
  <teleport to="body">
    <Transition name="modal" appear>
      <div
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
        @click.self="$emit('close')"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <div
          class="bg-white rounded-3xl py-7 px-9 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-all"
          :class="{ 'is-dragging': isDragging }"
        >
          <button
            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
            @click="$emit('close')"
          >
            &times;
          </button>

          <h2 class="text-2xl font-semibold text-np mb-4">
            Adicionar foto de perfil
          </h2>

          <p class="mb-5 text-[#351F56] text-center text-xl">
            Arraste e solte uma imagem aqui,
            ou clique no botão abaixo para
            selecionar do seu dispositivo.
          </p>

          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="hidden" />

          <div class="flex justify-center mt-6">
            <Button
              mediumPurple
              class="w-max pr-3 pl-2 h-[42px]"
              label="Escolher uma foto"
              @click="triggerFileInput"
            />
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({});

const emit = defineEmits(["close", "imageSelected"]);

const fileInput = ref(null);
const isDragging = ref(false);

const handleFile = (file) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      emit('imageSelected', event.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    isDragging.value = false;
  }
};

const onFileChange = (e) => {
  handleFile(e.target.files[0]);
  e.target.value = '';
};

const onDrop = (e) => {
  isDragging.value = false;
  handleFile(e.dataTransfer.files[0]);
};

const triggerFileInput = () => {
  fileInput.value.click();
};
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

.is-dragging {
  border: 4px dashed #8b5cf6;
  background-color: #f5f3ff;
  transform: scale(1.02);
}
</style>