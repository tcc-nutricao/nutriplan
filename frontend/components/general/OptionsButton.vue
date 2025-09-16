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
                :class="selectedButton && selectedButton.label === button.label ? 'border-2 font-semibold' : ''"
                :mediumPurple="selectedButton && selectedButton.label === button.label"
                :darkGray="(!selectedButton || selectedButton.label !== button.label) && !props.error"
                @click="selectButton(button)" />
        </Flex>
        <Error v-model="props.error" :message="props.error" />
    </FlexCol>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    buttons: Array,
    error: String,
    outlined: Boolean
})

const emits = defineEmits(['update:modelValue'])

const selectedButton = ref(null)

const selectButton = (button) => {
    selectedButton.value = button
    emits('update:modelValue', button)
}
</script>
