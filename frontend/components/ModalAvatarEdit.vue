<template>
  <teleport to="body">
    <Transition name="modal" appear>
      <div
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
        @click.self="$emit('close')"
      >
        <div
          class="bg-white rounded-3xl py-7 px-9 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto modal-container"
        >
          <button
            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
            @click="$emit('close')"
          >
            &times;
          </button>

          <h2 class="text-2xl font-semibold text-np mb-4">
            Editar foto de perfil
          </h2>

          <ClientOnly>
            <div class="h-80 w-full mt-4 mb-3 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
              <Cropper
                ref="cropper"
                class="h-full w-full"
                :src="imageSrc"
                :stencil-component="CircleStencil"
                :stencil-props="{
                    aspectRatio: 1/1, 
                    previewClass: 'previewCircle',
                    handlers: {},
                    lines: {},
                    movable: false,
                    resizable: false,
                    aspectRatio: 1,
                }"
                :resize-image="{
                    adjustStencil: false
                }"
                :stencil-size="{
                    width: 280,
                    height: 280
                }"
                image-restriction="stencil"
              />
            </div>
            <div class="hidden lg:flex w-full justify-center text-p-600">
                <p>Dê zoom com a roda do mouse!</p>
            </div>
             
            <template #fallback>
              <div class="h-80 w-full my-4 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                <p class="text-gray-500">Carregando editor...</p>
              </div>
            </template>
          </ClientOnly>

          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="hidden" />

          <div class="flex justify-center mt-6">
            <div class="flex gap-3">
              <Button
                mediumPurple
                outlined
                class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                label="Escolher outra foto"
                @click="triggerFileInput"
              />
              <Button
                mediumPurple
                class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                label="Confirmar"
                @click="cropImage"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from "vue";
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  currentImage: {
    type: String,
    default: 'https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg'
  }
});

const emit = defineEmits(["close", "save"]);

const cropper = ref(null);
const fileInput = ref(null);
const imageSrc = ref(props.currentImage);

onMounted(() => {
  if (!imageSrc.value) {
    imageSrc.value = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
});

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imageSrc.value = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const cropImage = () => {
  if (cropper.value) {
    const { canvas } = cropper.value.getResult();
    if (canvas) {
      const croppedDataUrl = canvas.toDataURL('image/png');
      emit("save", croppedDataUrl);
      emit("close");
    }
  }
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

.previewCircle {
    border: dashed 2px rgba(255,255,255, 1);
}
</style>