<template>
  <div ref="searchBarContainer" class="flex flex-row gap-2 bg-transparent">
    <Input
      class="bg-white w-full shadow-lg shadow-gray-600/10 focus-within:shadow-p-600/20 hover:shadow-p-600/20 transition"
      label="pesquisaReceita"
      :placeholder="placeholder"
    />

    <ButtonSelect
      v-if="filter"
      mediumPurple
      :label="isNarrow ? '' : 'Filtrar'"
      class="w-auto h-[42px]"
      icon="fa-solid fa-filter"
      :options="filterOptions"
    />
    <ButtonSelect
      v-if="sort"
      mediumPurple
      :label="isNarrow ? '' : 'Ordenar'"
      class="w-auto h-[42px]"
      icon="fa-solid fa-arrow-down-short-wide"
      :options="sortOptions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps({
  filter: {
    type: Boolean,
    default: true
  },
  filterOptions: {
    type: Array,
    default: () => [
      { value: 'all', label: 'Todos' },
      { value: 'favorites', label: 'Favoritos' },
    ]
  },
  sort: {
    type: Boolean,
    default: true
  },
  sortOptions: {
    type: Array,
    default: () => [
      { value: 'alphabetical', label: 'Ordem Alfabética' },
      { value: 'recent', label: 'Mais Recentes' },
      { value: 'time', label: 'Tempo de Preparo' },
    ]
  },
  placeholder: {
    type: String,
    default: 'Pesquise aqui'
  }
});

const searchBarContainer = ref(null);

const isNarrow = ref(false);

let observer;

onMounted(() => {
  observer = new ResizeObserver(entries => {
    const entry = entries[0];
    const width = entry.contentRect.width;

    isNarrow.value = width < 450;
  });

  if (searchBarContainer.value) {
    observer.observe(searchBarContainer.value);
  }
});

onBeforeUnmount(() => {
  if (observer && searchBarContainer.value) {
    observer.unobserve(searchBarContainer.value);
  }
});
</script>