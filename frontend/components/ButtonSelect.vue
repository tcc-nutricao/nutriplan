<template>
  <div class="relative" ref="selectMenu">
    <Button
      @click="toggleDropdown"
      mediumPurple
      :label="isNarrow ? '' : label"
      class="w-auto px-2 h-[42px]"
      :icon="icon"
      aria-haspopup="listbox" 
      :aria-expanded="isOpen"
    />
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
  modelValue: [String, Number, Boolean],
  icon: String,
  label: String,
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
  }
});

const emits = defineEmits(['update:modelValue']);

const isNarrow = ref(false);

const isOpen = ref(false);

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
  observer = new ResizeObserver(entries => {
    const entry = entries[0];
    const width = entry.contentRect.width;

    isNarrow.value = width < 450;
  });
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>