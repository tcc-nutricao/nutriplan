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
        class="absolute ring-2 ring-p-200 border-1 border-p-300 mt-1 rounded-xl bg-white py-2 text-base shadow-lg focus:outline-none w-[280px] max-h-[260px] sm:max-h-60 overflow-auto right-0 z-[9999]"
        role="listbox"
      >
        <li
          v-for="option in options"
          :key="option.value"
          @click="toggleOption(option)"
          class="relative flex items-center gap-2 cursor-pointer select-none py-[10px] px-4 mx-2 rounded-lg text-p-950 hover:bg-p-100 hover:text-p-700 transition"
          role="option"
          :aria-selected="isSelected(option.value)"
        >
          <Checkbox
            :modelValue="isSelected(option.value)"
            @update:modelValue="() => {}"
            class="pointer-events-none"
          />

          <i
            v-if="option.icon !== undefined"
            :class="'fa-solid ' + option.icon"
          ></i>
          <span
            :class="[
              isSelected(option.value) ? 'font-semibold' : 'font-normal',
              'block truncate',
            ]"
          >
            {{ option.label }}
          </span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
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
    default: "Selecione opções",
  },
  error: {
    type: [Boolean, String],
    default: false,
  },
});

const emits = defineEmits(["update:modelValue"]);

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
  if (isOpen.value) {
    await nextTick();
    updatePosition();
  }
};

const isSelected = (value) => {
  return props.modelValue.includes(value);
};

const toggleOption = (option) => {
  let newValue = [...props.modelValue];


  const index = newValue.indexOf(option.value);
  if (index === -1) {
    newValue.push(option.value);
  } else {
    newValue.splice(index, 1);
  }

  emits("update:modelValue", newValue);
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