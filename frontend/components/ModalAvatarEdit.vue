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
        @click.self="$emit('close')"
      >
        <div
          class="bg-white rounded-3xl py-7 px-9 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-transform duration-300 ease"
        >
          <button
            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
            @click="$emit('close')"
          >
            &times;
          </button>

          <h2 class="text-2xl font-semibold text-np mb-4">
            {{title == 'avatarEdit' ? 'Editar foto de perfil' : 'Editar capa do grupo'}}
          </h2>

          <ClientOnly>
            <div class="h-80 w-full mt-4 mb-3 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
              <Cropper
                v-if="title == 'avatarEdit'"
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
              <Cropper
                v-else
                ref="cropper"
                class="h-full w-full cursor-move"
                :src="imageSrc"
                :stencil-component="RectangleStencil"
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

          <p v-if="errorMessage" class="text-red-500 text-center text-sm font-medium my-2">
            {{ errorMessage }}
          </p>

          <input type="file" ref="fileInput" @change="onFileChange" accept="image/png, image/jpeg" class="hidden" />

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
import { ref, onMounted } from "vue";
import { Cropper, RectangleStencil, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  currentImage: {
    type: String,
    default: 'https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg'
  },
  title: String,
});

const emit = defineEmits(["close", "save"]);

const cropper = ref(null);
const fileInput = ref(null);
const imageSrc = ref(props.currentImage);
const errorMessage = ref(null);

onMounted(() => {
  if (!imageSrc.value) {
    imageSrc.value = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
});

const onFileChange = (e) => {
  const file = e.target.files[0];
  errorMessage.value = null;

  if (file) {
    const validTypes = ['image/png', 'image/jpeg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      errorMessage.value = "Apenas arquivos PNG e JPG são permitidos.";
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      errorMessage.value = "O arquivo deve ter no máximo 2MB.";
      e.target.value = '';
      return;
    }

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
      // Use JPEG with 0.8 quality to significantly reduce file size
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      emit("save", croppedDataUrl);
      emit("close");
    }
  }
};
</script>

<style>
.previewCircle {
    border: dashed 2px rgba(255,255,255, 1);
}
</style>