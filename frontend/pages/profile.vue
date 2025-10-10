<template>
  <div class="xl:mr-60 lg:mr-40">
    <div class="flex justify-center mb-3">
      <div class="w-full max-w-4xl text-start">
        <h1 class="h1">Meu perfil</h1>
      </div>
    </div>
    <ProfileCardHorizontal
      nome="Luna"
      email="luna@gmail.com"
      @edit="openModal('basic')"
    />

    <div class="bg-white rounded-3xl shadow-lg p-6 w-full max-w-4xl mx-auto mt-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="h2main">Dados Pessoais</h2>
      <Button mediumPurple
        class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
        icon="fa-regular fa-edit short flex justify-center" label="Editar" @click="openModal('personal')" 
      />
    </div>

    <div class="flex w-full gap-8">
      <div class="col w-full gap-4">
        <InfoArea 
        :value="personalData.idade ? `${personalData.idade} anos` : 'Não informado'"
        :title="'Idade'" 
        />
        <InfoArea 
        :value="personalData.altura ? `${personalData.altura} cm` : 'Não informado'" 
        :title="'Altura'" 
        />
        <InfoArea 
        :array="personalData.restricoes || 'Não informado'" 
        :title="'Restrições Alimentares'" 
        />
        <InfoArea 
        :value="personalData.preferencias || 'Não informado'" 
        :title="'Preferências Alimentares'" 
        />
      </div>
      <div class="col w-full gap-4">
        <InfoArea 
        :value="personalData.sexo || 'Não informado'" 
        :title="'Sexo'" 
        />
        <InfoArea 
        :value="personalData.peso ? `${personalData.peso} kg` : 'Não informado'" 
        :title="'Peso'" 
        />
        <InfoArea 
        :value="personalData.objetivo || 'Não informado'" 
        :title="'Objetivo'" 
        />
      </div>
    </div>
  </div>

  <!-- <Transition name="modal"> -->
    <ProfileEditModal
      v-if="showModal"
      :key="activeSection"
      :section="activeSection"
      @close="closeModal"
    />
  <!-- </Transition> -->
  </div>
</template>

<script>
export default {
  name: "Profile",
  components: {
    ProfileCardHorizontal: () =>
      import("../components/ProfileCardHorizontal.vue"),
    ProfileEditModal: () => import("../components/ProfileEditModal.vue"),
  },
  data() {
    return {
      showModal: false,
      activeSection: null,
      personalData: {
        idade: 15,
        sexo: "Feminino",
        altura: 165,
        peso: 65,
        restricoes: ["Sem glúten", "Sem lactose"],
        objetivo: "Perda de Peso",
        preferencias: "Dieta mediterrânea"
      }
    };
  },
  props: {
    idade: Number,
    sexo: String,
    altura: Number,
    peso: Number,
    restricoes: String,
    objetivo: String,
    preferencias: String
  },
  methods: {
    openModal(section) {
      console.log("Abrindo modal para seção:", section);
      this.activeSection = section;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.activeSection = null;
    },
  },
};
</script>

<style>
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from :deep(.modal-container) { 
  transform: scale(0.9);
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-to :deep(.modal-container) { 
  transform: scale(0.9);
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
</style>