<template>
  <div class="relative" ref="selectMenu">
    <button @click="toggleDropdown"
      class="relative w-full cursor-pointer rounded-xl border-2 text-sm h-[42px] bg-white py-2 pl-3 pr-10 text-left focus:outline-none transition"
      :class="classes" 
      aria-haspopup="listbox" 
      :aria-expanded="isOpen"
    >
      <span class="block truncate" :class="{ 'text-gray-400': !modelValue }">
        {{ selectedLabel || placeholder }}
      </span>

      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l2.47-2.47a.75.75 0 111.06 1.06l-3.5 3.5a.75.T75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z"
            clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-2"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-2"
    >
      <ul v-if="isOpen"
        class="absolute ring-2 ring-p-200 border-1 border-p-300 z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-lg focus:outline-none"
        role="listbox">
        <li v-for="option in options" :key="option.value" @click="selectOption(option)"
          class="relative cursor-pointer select-none py-[10px] px-4 mx-2 rounded-lg text-p-950 hover:bg-p-100 hover:text-p-700 transition"
          role="option" :aria-selected="option.value === modelValue">
          <span :class="[option.value === modelValue ? 'font-semibold' : 'font-normal', 'block truncate']">
            {{ option.label }}
          </span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: [Array, String, Number, Boolean],
  options: {
    type: Array,
    required: true,
    validator: (value) => value.every((opt) => "value" in opt && "label" in opt),
  },
  placeholder: {
    type: String,
    default: 'Selecione uma opção'
  },
  error: {
    type: [Boolean, String],
    default: false
  },
  required: Boolean,
});

const emits = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const classes = computed(() => {
  const hasError = !!props.error;

  return {
    'border-red-500': hasError,
    'text-red-500': hasError,
    'border-p-600': !hasError && isOpen.value,
    'border-p-g2': !hasError && !isOpen.value,
  };
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  emits('update:modelValue', option.value);
  isOpen.value = false;
};

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected ? selected.label : null;
});

const selectMenu = ref(null);

const handleClickOutside = (event) => {
  if (isOpen.value && !selectMenu.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>