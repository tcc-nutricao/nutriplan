<template>
    <div class="relative flex items-center justify-center w-max">
        <Transition
            enter-active-class="transition-opacity duration-100 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            :leave-active-class="'transition-opacity duration-' + duration + ' ease-in'"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="visible"
                class="absolute bottom-full mb-2 px-2 py-1 bg-p-200 border-2 border-p-400 text-p-600 text-sm rounded shadow-lg whitespace-nowrap z-10">
                {{ text }}
                <div class="absolute top-[105%] left-1/2 transform -translate-x-1/2 border-[0.4em] border-transparent border-t-p-400">
                </div>
            </div>
        </Transition>
        <slot></slot>
    </div>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        default: 300
    }
});
</script>