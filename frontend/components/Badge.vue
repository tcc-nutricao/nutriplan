<template>
    <div class="flex justify-center align-items border-2 px-2 py-1 bg-p-100 transition 
        border-p-400 rounded-xl text-[1.25em] font-[500] text-p-600 hover:bg-p-200 cursor-pointer active:scale-95 select-none">
        {{ label }}
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true,
        default: () => (null)
    }
});
</script>