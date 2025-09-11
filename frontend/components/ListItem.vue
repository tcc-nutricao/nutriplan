<template>
  <ul class="flex flex-col gap-1 w-full">
    <li
      v-for="(item, index) in items"
      :key="index"
      @click="selectItem(item)"
      class="font-sora cursor-pointer select-none text-white transition-all duration-150 ease-in-out px-3 py-2 rounded-lg"
      :class="{
        'bg-white/20': item.label === activeItem,
        'hover:bg-white/10': item.label !== activeItem,
        'flex justify-center hover:scale-[115%] active:scale-95': isMinimized,
        'hover:scale-105 active:scale-95': !isMinimized
      }"
    >
      <!-- Mostra o label apenas se não estiver minimizado -->
      <span v-if="!isMinimized">{{ item.label }}</span>
      
      <!-- Mostra o ícone apenas se estiver minimizado -->
      <i v-if="isMinimized" :class="`fa-solid ${item.icon}`" :title="item.label" />
    </li>
  </ul>
</template>

<script setup>
// O componente agora é "burro" (dumb component). Ele apenas recebe dados (props)
// e emite eventos. Não tem mais lógica de estado própria.

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  // Prop para receber o item que está ativo no componente pai
  activeItem: {
    type: String,
    default: null
  },
  // Prop para saber se deve renderizar no modo ícone
  isMinimized: {
    type: Boolean,
    default: false
  }
});

// Define o evento que este componente pode emitir
const emit = defineEmits(['item-selected']);

// Ao clicar, emite o evento para o pai com o item clicado
const selectItem = (item) => {
  emit('item-selected', item);
};
</script>
