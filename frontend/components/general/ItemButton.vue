<template>
    <button class="group flex items-center justify-center bg-p-200 rounded-xl 
      hover:bg-p-200 text-p-600 cursor-default transition w-max px-4 pr-2 h-[42px]">
        <div class="flex items-center justify-center py-2 gap-2 transition">
            <p class="text-nowrap">{{ label }} ({{ quantity }} {{ unity }})</p>
            <div @click="emitDelete" class="cursor-pointer flex h-[30px] w-[80%] px-2 py-1 hover:scale-110 active:scale-95 hover:text-danger rounded-lg justify-center items-center">
                <i class="fa-solid fa-trash-can text-md"></i>
            </div>
        </div>
    </button>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps({
        label: String,
        quantity: String,
        unity: String
    })

    const emit = defineEmits(['delete-item'])

    function emitDelete() {
        emit('delete-item')
    }
</script>