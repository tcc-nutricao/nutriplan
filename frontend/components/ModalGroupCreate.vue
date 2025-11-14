<template>
  <teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="showModal != 'groupEdit'"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
        @click.self="$emit('close')"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <div
          class="bg-white rounded-3xl py-7 px-9 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto modal-container"
          :class="{ 'is-dragging': isDragging }"
        >
          <button
            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
            @click="$emit('close')"
          >
            &times;
          </button>

          <h2 class="text-2xl font-semibold text-np mb-4">
            {{ title }} grupo
          </h2>

          <InputText
            class="mb-5"
            label="Nome do grupo"
            placeholder="Insira o nome do grupo"
            v-model="object.name"
            :error="errors.name"
            required 
          />
          <Label label="Foto de capa" class="mb-2" />
          <div class="flex w-full gap-7 items-center">
            <div class="flex items-center justify-center w-[9rem] h-[9rem] rounded-xl bg-p-200 cursor-pointer transition active:scale-95 group overflow-hidden flex-shrink-0"
              @click="triggerFileInput">
              <img v-if="object.image" :src="object.image" alt="Prévia da capa do grupo" class="w-full h-full object-cover">
              <i v-else class="fa-solid fa-arrow-up-from-bracket text-[5rem] text-np group-hover:scale-[110%] transition group-active:scale-100"></i>
            </div>
            <p class="text-[#351F56] text-start text-md">
            <span v-if="!object.image">
              Arraste e solte uma imagem aqui, ou clique no ícone para selecionar do seu dispositivo.
            </span>
            <span v-else>
              Clique na imagem para escolher outra foto.
            </span>
          </p>
          </div>
          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="hidden" />


          <div class="flex justify-center mt-6">
            <div class="flex gap-3">
              <Button
                gray
                outlined
                class="w-max pr-3 pl-2 h-[42px]"
                label="Cancelar"
                @click="$emit('close')"
              />
              <Button
                mediumPurple
                class="w-max pr-3 pl-2 h-[42px]"
                label="Salvar"
                @click="save"
              />
            </div>
          </div>
        </div>
      </div>
      <ModalAvatarEdit v-else
        v-if="showModal == 'groupEdit'"
        :title="showModal"
        :current-image="imageToEdit"
        @close="closeModal"
        @save="handleAvatarSave"
      />
    </Transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  title: String,
  initialData: { type: Object, default: () => ({ name: null, image: null }) }
});
const object = ref({
  name: null,
  image: null
})
const errors = ref({
  name: null,
})

const isDragging = ref(false);
const fileInput = ref(null);
const imageToEdit = ref(null);

const handleFile = (file) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      // emit('imageSelected', event.target.result);
      handleImageSelected(event.target.result);
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

const save = () => {
  errors.value.name = null;
  if (!object.value.name) {
    errors.value.name = 'O nome do grupo é obrigatório.';
    return;
  }

  emit('save', object.value);
  // Limpa o formulário e fecha o modal após salvar
  object.value = { name: null, image: null };
  errors.value = { name: null };
  emit('close');
}

const emit = defineEmits(["close", "save"]);

onMounted(() => {
  // Preenche o formulário com dados iniciais (útil para edição)
  object.value = { ...props.initialData };
});

const showModal = ref("");

const handleImageSelected = (imageData) => {
  imageToEdit.value = imageData;
  showModal.value = "groupEdit";
};

const handleAvatarSave = (croppedImage) => {
  object.value.image = croppedImage;
  closeModal();
};

const closeModal = () => {
  showModal.value = "";
  imageToEdit.value = null;
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