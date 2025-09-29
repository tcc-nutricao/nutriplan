<template>
  <div class="w-full">
        <p class="text-gray-600 text-sm mb-1">{{title}}</p>
        <p v-if="array" class="bg-p-100 text-p-800 font-semibold px-3 py-2 rounded-md inline-block w-full">
          <span v-for="(item, index) in array" :key="index">
            {{ item }}<span v-if="index < array.length - 1">, </span>
          </span>
        </p>
        <p v-else class="bg-p-100 text-p-800 font-semibold px-3 py-2 rounded-md inline-block w-full">{{ value }}</p>
      </div>
</template>

<script>
export default {
  name: "InfoArea",
  props: {
    title: { type: String, required: true },
    value: { type: String, required: false },
    array: { type: Array, required: false }
  },
};

</script>
