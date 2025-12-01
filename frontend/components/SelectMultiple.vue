<template>
  <div class="relative" ref="selectMenu">
    <Label class="mb-1" v-if="label" :label="label" :required="required" :error="error" />

    <button @click="toggleDropdown"
      class="relative w-full cursor-pointer rounded-xl border-2 text-sm h-[42px] bg-white py-2 pl-3 pr-10 text-left focus:outline-none transition"
      :class="classes" 
      aria-haspopup="listbox" 
      :aria-expanded="isOpen"
    >
      <span class="block truncate" :class="{ 'text-gray-400': !modelValue || modelValue.length === 0 }">
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
        class="absolute ring-2 ring-p-200 border-1 border-p-300 z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-lg focus:outline-none"
        style="min-width: max-content;"
        role="listbox">
        <li v-for="option in sortedOptions" :key="option.value" @click="toggleOption(option)"
          class="relative cursor-pointer select-none py-[10px] px-4 mx-2 rounded-lg text-p-950 hover:bg-p-100 hover:text-p-700 transition"
          role="option" :aria-selected="isSelected(option.value)">
          <Checkbox 
            :modelValue="isSelected(option.value)" 
            :label="option.label"
            class="pointer-events-none"
            @update:modelValue="() => {}"
          />
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => value.every((opt) => "value" in opt && "label" in opt),
  },
  placeholder: {
    type: String,
    default: 'Selecione opções'
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

const isSelected = (value) => {
  return props.modelValue.includes(value);
};

const toggleOption = (option) => {
  const currentValue = props.modelValue || [];
  const index = currentValue.indexOf(option.value);
  
  let newValue;
  if (index === -1) {
    newValue = [...currentValue, option.value];
  } else {
    newValue = currentValue.filter(v => v !== option.value);
  }
  
  emits('update:modelValue', newValue);
};

const sortedOptions = computed(() => {
  if (!props.modelValue || props.modelValue.length === 0) {
    return props.options;
  }

  const selected = [];
  const notSelected = [];

  props.options.forEach(option => {
    if (isSelected(option.value)) {
      selected.push(option);
    } else {
      notSelected.push(option);
    }
  });

  return [...selected, ...notSelected];
});

const selectedLabel = computed(() => {
  const count = props.modelValue ? props.modelValue.length : 0;
  
  if (count === 0) {
    return null;
  } else if (count === 1) {
    return '1 item selecionado';
  } else {
    return `${count} itens selecionados`;
  }
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