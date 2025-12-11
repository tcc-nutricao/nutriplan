<template>
  <div class="relative" ref="selectMenu">
    <Label class="mb-1" v-if="label" :label="label" :required="required" :error="error" />

    <button @click="toggleDropdown"
      class="relative w-full cursor-pointer rounded-xl border-2 border-p-g2 text-sm h-[42px] bg-white py-2 pl-3 pr-10 text-left focus:outline-none transition"
      :class="{'border-red-500': error}" 
      aria-haspopup="listbox" 
      :aria-expanded="isOpen"
    >
      <span class="block truncate" :class="{ 'text-gray-400': !modelValue }">
        {{ selectedLabel || placeholder }}
      </span>

      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <i class="fa-solid fa-chevron-down text-gray-400"></i>
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
        :style="dropdownStyle"
        class="absolute top-full md:left-0 md:translate-x-0 md:translate-y-0 z-[1005] md:z-10 mt-1 max-h-[50vh] md:max-h-60 overflow-auto rounded-xl bg-white py-2 text-base shadow-2xl md:shadow-lg focus:outline-none ring-2 ring-p-200 border-1 border-p-300"
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

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
  label: {
    type: String,
  },
  required: Boolean,
});

const emits = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdownStyle = ref({});

const updatePosition = () => {
  if (window.innerWidth < 768 && selectMenu.value) {
    const rect = selectMenu.value.getBoundingClientRect();
    dropdownStyle.value = {
      left: `${-rect.left + 14}px`,
      width: 'calc(100vw - 28px)',
    };
  } else {
    dropdownStyle.value = {};
  }
};

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    updatePosition();
  }
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
  window.addEventListener('resize', () => {
      if(isOpen.value) updatePosition();
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updatePosition);
});
</script>