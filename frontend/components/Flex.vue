<template>
  <div
    class="flex"
    :class="[
      { 'items-center justify-center': center },
      { 'items-start': itemsStart },
      { 'items-center': itemsCenter },
      { 'items-end': itemsEnd },
      { 'justify-start': justifyStart },
      { 'justify-center': justifyCenter },
      { 'justify-end': justifyEnd },
      { 'justify-between': justifyBetween },
      { 'gap-1': gap1 },
      { 'gap-2': gap2 },
      { 'gap-3': gap3 },
      { 'gap-4': gap4 },
      { 'gap-5': gap5 },
      { 'gap-6': gap6 },
      { 'gap-7': gap7 },
      { 'gap-8': gap8 },
      { 'gap-9': gap9 },
      { 'gap-10': gap10 },
    ]"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    center: Boolean,
    itemsStart: Boolean,
    itemsCenter: Boolean,
    itemsEnd: Boolean,
    justifyStart: Boolean,
    justifyCenter: Boolean,
    justifyEnd: Boolean,
    justifyBetween: Boolean,
    gap1: Boolean,
    gap2: Boolean,
    gap3: Boolean,
    gap4: Boolean,
    gap5: Boolean,
    gap6: Boolean,
    gap7: Boolean,
    gap8: Boolean,
    gap9: Boolean,
    gap10: Boolean,
  },
};
</script>