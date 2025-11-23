<template>
  <div ref="searchBarContainer" class="w-full flex flex-row gap-2 bg-p-g">
    <Search
      :type="searchType"
      :placeholder="placeholder"
      @update:modelValue="handleSearchSelection"
       class="w-full"
    />

    <ButtonSelectMultiple
      v-if="filter"
      mediumPurple
      :label="isNarrow ? '' : 'Filtrar'"
      class="w-auto h-[42px]"
      icon="fa-solid fa-filter"
      :options="filterOptions"
      v-model="selectedFilter"
    />
    <ButtonSort
      v-if="sort"
      mediumPurple
      :label="isNarrow ? '' : 'Ordenar'"
      class="w-auto h-[42px]"
      icon="fa-solid fa-arrow-down-short-wide"
      :options="sortOptions"
      v-model="selectedSort"
      v-model:direction="sortDirection"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  searchType: {
    type: String,
    required: true,
    validator: (value) => ['recipes', 'patients', 'foods'].includes(value)
  },
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
      { 
        value: 'created_at', 
        label: 'Data de Criação', 
        labelAsc: 'Mais Antigas', 
        labelDesc: 'Mais Recentes',
        defaultDirection: 'desc'
      },
      { 
        value: 'name', 
        label: 'Alfabética', 
        labelAsc: 'A-Z', 
        labelDesc: 'Z-A',
        defaultDirection: 'asc'
      },
      { 
        value: 'preparation_time', 
        label: 'Tempo de Preparo', 
        labelAsc: 'Mais Rápido', 
        labelDesc: 'Mais Demorado',
        defaultDirection: 'asc'
      },
    ]
  },
  placeholder: {
    type: String,
    default: 'Pesquise aqui'
  }
});

const emits = defineEmits(['searchSelected', 'filterSelected', 'sortSelected']);

const searchBarContainer = ref(null);
const isNarrow = ref(false);
const selectedFilter = ref(['all']);
const selectedSort = ref('created_at');
const sortDirection = ref('desc');

let observer;

const handleSearchSelection = (selectedItem) => {
  emits('searchSelected', selectedItem);
};

watch(selectedFilter, (newValue, oldValue) => {
  // Logic for exclusive options
  const newSelection = newValue.filter(x => !oldValue.includes(x)); // What was just added?
  
  if (newSelection.length > 0) {
    const added = newSelection[0];
    
    if (added === 'all') {
      // If 'all' is selected, clear everything else
      selectedFilter.value = ['all'];
      return;
    } else if (added === 'favorites') {
      // If 'favorites' is selected, clear everything else
      selectedFilter.value = ['favorites'];
      return;
    } else {
      // If a preference is selected, remove 'all' and 'favorites'
      if (selectedFilter.value.includes('all')) {
        selectedFilter.value = selectedFilter.value.filter(v => v !== 'all');
      }
      if (selectedFilter.value.includes('favorites')) {
        selectedFilter.value = selectedFilter.value.filter(v => v !== 'favorites');
      }
    }
  } else {
    // Something was removed
    if (newValue.length === 0) {
      // If everything removed, default back to 'all'
      selectedFilter.value = ['all'];
      return;
    }
  }

  emits('filterSelected', selectedFilter.value);
});

watch([selectedSort, sortDirection], ([newSort, newDirection]) => {
  emits('sortSelected', { column: newSort, direction: newDirection });
});

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