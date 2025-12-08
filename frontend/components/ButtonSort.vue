<template>
  <div class="relative z-1000" ref="selectMenu">
    <Button
      @click="toggleDropdown"
      mediumPurple
      class="w-auto px-2 h-[42px]"
      :label="label"
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
      <ul
        v-if="isOpen"
        class="absolute ring-2 ring-p-200 border-1 border-p-300 mt-1 rounded-xl bg-white py-2 text-base shadow-lg focus:outline-none w-[240px] max-h-[160px] sm:max-h-60 overflow-auto right-0 z-[9999]"
        role="listbox"
      >
        <li
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="relative flex items-center gap-2 cursor-pointer select-none py-[10px] px-4 mx-2 rounded-lg text-p-950 hover:bg-p-100 hover:text-p-700 transition"
          role="option"
          :aria-selected="option.value === modelValue"
        >
          <div class="flex items-center gap-2 w-full justify-between">
            <span
              :class="[
                option.value === modelValue ? 'font-semibold' : 'font-normal',
                'block truncate',
              ]"
            >
              {{ getOptionLabel(option) }}
            </span>
            <i
              v-if="option.value === modelValue"
              :class="[
                'fa-solid',
                direction === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down',
                'text-xs ml-2',
              ]"
            >
            </i>
          </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: [String, Number, Boolean],
  direction: {
    type: String,
    default: "asc",
    validator: (value) => ["asc", "desc"].includes(value),
  },
  icon: String,
  label: String,
  options: {
    type: Array,
    required: true,
    validator: (value) =>
      value.every((opt) => "value" in opt && "label" in opt),
  },
  placeholder: {
    type: String,
    default: "Selecione uma opção",
  },
  error: {
    type: [Boolean, String],
    default: false,
  },
});

const emits = defineEmits(["update:modelValue", "update:direction"]);

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  if (option.value === props.modelValue) {
    // Toggle direction
    const newDirection = props.direction === "asc" ? "desc" : "asc";
    emits("update:direction", newDirection);
  } else {
    // New selection
    emits("update:modelValue", option.value);
    // Default direction for new selection (can be customized per option if needed, defaulting to asc)
    const defaultDir = option.defaultDirection || "asc";
    emits("update:direction", defaultDir);
  }
  isOpen.value = false;
};

const getOptionLabel = (option) => {
  if (option.value === props.modelValue) {
    if (props.direction === "asc" && option.labelAsc) return option.labelAsc;
    if (props.direction === "desc" && option.labelDesc) return option.labelDesc;
  }
  return option.label;
};

const selectMenu = ref(null);

const handleClickOutside = (event) => {
  if (isOpen.value && !selectMenu.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
