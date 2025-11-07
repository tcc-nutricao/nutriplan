<template>
<Flex gap-2 items-center>

    <label class="flex items-center cursor-pointer select-none">
  
    <input type="checkbox" class="sr-only peer"
        :checked="modelValue"
        @change="emits('update:modelValue', $event.target.checked)"
    >

    <span 
        class="
        relative flex items-center justify-center
        w-5 h-5 mr-2 
        bg-transparent border-2 border-gray-400 
        rounded-md
        transition duration-200
        
        peer-checked:bg-p-500 
        peer-checked:border-p-500
        
        peer-focus-visible:ring-2
        peer-focus-visible:ring-p-500
        peer-focus-visible:ring-offset-2
        
        after:content-['']
        after:absolute
        after:hidden
        after:w-[5px]
        after:h-[10px]
        after:border-solid
        after:border-white
        after:border-b-[3px]
        after:border-r-[3px]
        after:rotate-45
        
        peer-checked:after:block
        "
    ></span>

    <span class="text-p-950 peer-checked:text-np">{{ label }} </span>
        </label>
</Flex>
</template>

<script setup>

const props = defineProps({
    modelValue: Boolean,
    label: String,
})

const emits = defineEmits(['update:modelValue'])

</script>

