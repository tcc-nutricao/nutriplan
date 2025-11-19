<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-1">
      <h3 :class="[titleClass, 'text-base font-semibold text-gray-800']">
        {{ title }}
      </h3>
      <span class="text-sm font-bold text-p-700">{{ progress ?? 0 }}%</span>
    </div>
    <p v-if="subTitle" class="font-light text-xs text-gray-500 mb-2">
      {{ subTitle }}
    </p>

    <!-- Tipo 1: Com borda -->
    <div
      v-if="type === '1'"
      class="w-full p-0.5 flex items-center justify-start bg-transparent border-2 border-p-600 rounded-lg overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-p-500 to-p-700 rounded-md transition-all duration-500 shadow-progress"
        :style="{ width: animatedWidth + '%', height: height * 4 + 'px' }"
        style="transition: width 0.6s cubic-bezier(0.5, 1, 0.8, 1)"
      ></div>
    </div>

    <!-- Tipo 2: Sem borda, fundo claro -->
    <div
      v-else
      class="w-full flex items-center justify-start bg-p-200 rounded-full overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-p-500 to-p-700 rounded-full transition-all duration-500"
        :style="{ width: animatedWidth + '%', height: height * 4 + 'px' }"
        style="transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true,
      default: 0,
    },
    height: {
      type: [String, Number],
      default: 4,
      required: false,
    },
    type: {
      type: String,
      default: "1",
      required: false,
    },
    title: {
      type: String,
      default: "",
      required: false,
    },
    titleClass: {
      type: String,
      default: "",
      required: false,
    },
    subTitle: {
      type: String,
      default: "",
      required: false,
    },
  },
  data() {
    return {
      animatedWidth: 0,
    };
  },
  mounted() {
    setTimeout(() => {
      this.animatedWidth = Math.min(Math.max(this.progress || 0, 0), 100);
    }, 100);
  },
  watch: {
    progress(newValue) {
      this.animatedWidth = Math.min(Math.max(newValue || 0, 0), 100);
    },
  },
};
</script>

<style scoped>
.shadow-progress {
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
}
</style>
