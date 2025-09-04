<template>
  <div ref="searchBarContainer" class="flex flex-row gap-2">
    <Input
      class="mb-5 bg-white w-full shadow-lg shadow-gray-600/10 focus-within:shadow-p-600/20 hover:shadow-p-600/20 transition"
      label="pesquisaReceita"
      placeholder="Pesquise uma receita"
    />

    <Button
      v-if="filter"
      mediumPurple
      :label="isNarrow ? '' : 'Filtrar'"
      class="w-auto px-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
      icon="fa-regular fa-filter"
    />
    <Button
      v-if="sort"
      mediumPurple
      :label="isNarrow ? '' : 'Ordenar'"
      class="w-auto px-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
      icon="fa-solid fa-arrow-down-short-wide"
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
  sort: {
    type: Boolean,
    default: true
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