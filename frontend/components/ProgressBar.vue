<template>
    <div v-if="type === '1'" class="w-full p-0.5 flex items-center justify-start bg-transparent border-2 border-p-600 rounded-lg">
        <div class="bg-gradient-to-r from-p-500 to-p-700 h-4 rounded-md transition-all duration-500 shadow-xl shadow-p-600/20" 
            :style="{ width: progress + '%'  }" :class="[`h-${height}`]"
            style="transition: width 0.6s cubic-bezier(0.5, 1, 0.8, 1);"></div>
    </div>
    <div v-else="type === '2'" class="w-full p-0 flex items-center justify-start bg-p-300 border-0 border-p-600 rounded-full">
        <div class="bg-gradient-to-r from-p-500 to-p-700 h-4 rounded-full transition-all duration-500" 
            :style="{ width: progress + '%'  }" :class="[`h-${height}`]"
            style="transition: width 0.6s cubic-bezier(1, 0.5, 1, 0.8);"></div>
    </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true,
      default: 0
    },
    height: {
        type: String,
        default: '4',
        required: false
    },
    type: {
        type: String,
        default: '1',
        required: false
    },
  },
  data() {
    return {
      animatedWidth: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this.animatedWidth = this.progress;
    }, 50); 
  },
  watch: {
    progress(newValue) {
      this.animatedWidth = newValue;
    }
  }
}
</script>