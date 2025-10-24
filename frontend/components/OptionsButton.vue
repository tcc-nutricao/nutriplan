<template>
    <FlexCol gap-1>
        <Flex gap5>
            <Button 
                v-for="(button, index) of buttons" 
                :key="index" 
                :label="button.label"
                :required="button.required"
                :disabled="button.disabled"
                :outlined="outlined"
                class="w-full"
                :red="props.error"
                :class="props.modelValue && props.modelValue.label === button.label ? 'border-2 font-semibold' : ''"
                :mediumPurple="props.modelValue && props.modelValue.label === button.label"
                :darkGray="(!props.modelValue || props.modelValue.label !== button.label) && !props.error"
                @click="selectButton(button)" />
        </Flex>
        <Error v-model="props.error" :message="props.error" />
    </FlexCol>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
    modelValue: Object,
    buttons: Array,
    error: String,
    outlined: Boolean,
    changeSelected: Boolean
})

const emits = defineEmits(['update:modelValue', 'update:changeSelected']) 


const selectButton = (button) => {
    emits('update:modelValue', button)
}

watch(() => props.changeSelected, (newValue) => {
    if (newValue === true) {
        emits('update:modelValue', props.buttons[0]); 
        
        emits('update:changeSelected', false); 
    }
});
</script>
