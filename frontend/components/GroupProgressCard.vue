<template>
  <Card v-if="!props.loading && props.selectedItem">
    <div class="flex flex-col gap-3">
      <h2 class="h2 text-center">Progresso</h2>
      <div class="flex justify-between items-center">
        <h3
          class="text-lg text-center"
          :class="
            endingClass(calculateDaysRemaining(props.selectedItem.endDate))
          "
        >
          {{ calculateDaysRemaining(props.selectedItem.endDate) ?? "N/A" }}
        </h3>
        <div class="flex gap-6">
          <p class="text-md text-gray-600">
            Início:
            <span class="h3main">{{ formattedStartDate ?? "N/A" }}</span>
          </p>
          <p class="text-md text-gray-600">
            Final: <span class="h3main">{{ formattedEndDate ?? "N/A" }}</span>
          </p>
        </div>
      </div>
      <ProgressBar
        title="Progresso geral"
        :progress="groupProgress"
        :height="6"
      />

      <div>
        <h3 class="text-lg font-semibold text-gray-800 text-center mb-3">
          Progresso Individual
        </h3>
        <div class="flex flex-col gap-3">
          <ProgressBar
            v-for="participant in props.selectedItem.participants"
            :key="participant.id"
            :title="participant.name"
            :titleClass="
              participant.name === 'Você' ? 'font-bold text-p-700' : ''
            "
            :subTitle="participant.objective"
            :progress="participant.progress"
            :type="'2'"
            :height="4"
          />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  selectedItem: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const formattedStartDate = computed(() => {
  if (!props.selectedItem) return "";
  const dateString = props.selectedItem.startDate || "";
  const parts = dateString.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
});

const formattedEndDate = computed(() => {
  if (!props.selectedItem) return "";
  const dateString = props.selectedItem.endDate || "";
  const parts = dateString.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
});

function calculateDaysRemaining(endDateString) {
  if (!endDateString) return "N/A";

  const today = new Date();
  const endDate = new Date(endDateString + "T00:00:00");

  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (endDate < today) {
    return "Finalizado";
  }

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Termina hoje";
  }
  if (diffDays === 1) {
    return "Termina amanhã";
  }
  return `Termina em ${diffDays} dias`;
}

function endingClass(diffDays) {
  if (
    diffDays === "Finalizado" ||
    diffDays === "Termina hoje" ||
    diffDays === "Termina amanhã"
  ) {
    return "text-danger-light";
  } else {
    return "text-p-950";
  }
}

const groupProgress = computed(() => {
  if (
    !props.selectedItem ||
    !props.selectedItem.participants ||
    props.selectedItem.participants.length === 0
  ) {
    return 0;
  }

  const totalProgress = props.selectedItem.participants.reduce(
    (sum, participant) => {
      return sum + (participant.progress || 0);
    },
    0
  );

  const average = totalProgress / props.selectedItem.participants.length;
  return Math.round(average);
});
</script>
