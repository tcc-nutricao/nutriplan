<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-4">
    <!-- Botão Primeira Página -->
    <button
      @click="changePage(1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded-md text-p-800 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-p-100 transition"
    >
      <i class="fa-solid fa-angles-left"></i>
    </button>

    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded-md text-p-800 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-p-100 transition"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="[
        'px-3 py-1 rounded-md transition',
        { 'bg-p-500 text-white shadow-md': currentPage === page, 'hover:bg-p-100 text-p-800': currentPage !== page }
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded-md text-p-800 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-p-100 transition"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>

    <!-- Botão Última Página -->
    <button
      @click="changePage(totalPages)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded-md text-p-800 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-p-100 transition"
    >
      <i class="fa-solid fa-angles-right"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(['page-changed']);

const pages = computed(() => {
  const range = [];
  const start = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2));
  const end = Math.min(props.totalPages, start + props.maxVisiblePages - 1);

  const adjustedStart = Math.max(1, end - props.maxVisiblePages + 1);

  for (let i = adjustedStart; i <= end; i++) {
    range.push(i);
  }
  return range;
});

function changePage(page) {
  if (page > 0 && page <= props.totalPages) {
    emit('page-changed', page);
  }
}
</script>
