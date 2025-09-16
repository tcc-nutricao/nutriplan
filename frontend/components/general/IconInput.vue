<template>
  <Flex
    center
    class="w-[42px] h-full cursor-pointer text-[#5F6368]"
  >
    <IconSolid :icon="props.icon" />
  </Flex>
</template>

<script setup>
  const props = defineProps({
    icon: String
  })
</script>