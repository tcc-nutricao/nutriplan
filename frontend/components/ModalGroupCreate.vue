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
        v-if="showModal != 'groupEdit'"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
        @click.self="$emit('close')"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <div
          class="bg-white rounded-3xl py-7 px-9 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-transform duration-300 ease"
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

          <div class="flex gap-3 justify-between w-full">
            <InputText
              class="mb-5 w-full"
              label="Nome do grupo"
              placeholder="Insira o nome do grupo"
              v-model="object.name"
              :error="errors.name"
              required 
            />
            <div class="flex flex-col">

              <div class="flex w-full items-center">
                <Checkbox
                label="Data de término"
                class="mb-1"s
                v-model="hasEndDate"
                @update:modelValue="errors.endDate = null; object.endDate = null"
                />
              </div>
              <Input
                type="date"
                placeholder="Data de término"
                v-model="object.endDate"
                :error="errors.endDate"
                :disabled="!hasEndDate"
                required
              />
              <Error v-if="errors.endDate" :message="errors.endDate" class="mt-1" />
            </div>
          </div>
          <Label label="Foto de capa" class="mb-2" />
          <div class="flex flex-col w-full">
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
            <Error v-if="errors.image" :message="errors.image" class="mt-2" />
          </div>
          <input type="file" ref="fileInput" @change="onFileChange" accept="image/png, image/jpeg" class="hidden" />
          
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
import { ref, watchEffect } from "vue";

const props = defineProps({
  title: String,
  initialData: { type: Object, default: () => ({ name: null, image: null, endDate: null}) },
});
const object = ref({
  name: null,
  image: null,
  endDate: null,
})
const errors = ref({
  name: null,
  endDate: null,
  image: null,
})

const hasEndDate = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);
const imageToEdit = ref(null);

const handleFile = (file) => {
  errors.value.image = null;
  if (!file) return;

  const validTypes = ['image/png', 'image/jpeg'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!validTypes.includes(file.type)) {
    errors.value.image = "Apenas arquivos PNG e JPG são permitidos.";
    isDragging.value = false;
    return;
  }

  if (file.size > maxSize) {
    errors.value.image = "O arquivo deve ter no máximo 2MB.";
    isDragging.value = false;
    return;
  }

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
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
  }

  if (hasEndDate.value){
    errors.value.endDate = null;
    if (!object.value.endDate) {
      errors.value.endDate = 'Informe uma data ou desselecione.';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const oneYearFromNow = new Date(today);
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      const endDate = new Date(object.value.endDate + 'T00:00:00');

      if (endDate < today) {
        errors.value.endDate = 'A data não pode ser anterior a hoje.';
      } else if (endDate > oneYearFromNow) {
        errors.value.endDate = 'A data não pode ser mais de um ano no futuro.';
      }
    }
  }



  if (!errors.value.name && !errors.value.endDate)
  emit('save', object.value);
  else return;
}

const emit = defineEmits(["close", "save"]);

watchEffect(() => {
  if (props.initialData && Object.keys(props.initialData).length > 0) {
    object.value.name = props.initialData.title;
    object.value.image = props.initialData.picture;
    object.value.endDate = props.initialData.endDate ? props.initialData.endDate.split('T')[0] : null;
    hasEndDate.value = !!props.initialData.endDate;
  } else {
    object.value = { name: null, image: null, endDate: null };
  }
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
.is-dragging {
  border: 4px dashed #8b5cf6;
  background-color: #f5f3ff;
  transform: scale(1.02);
}
</style>