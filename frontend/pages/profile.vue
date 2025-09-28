<template>
  <div>
    <ProfileCardHorizontal
      nome="Luna Araújo"
      email="luna@gmail.com"
      @edit="openModal('basic')"
    />

    <ProfileCardPersonalInformation
      :idade="15"
      sexo="Feminino"
      :altura="165"
      :peso="65"
      restricoes="Sem glúten"
      objetivo="Ganhar massa muscular"
      preferencias="Dieta mediterrânea"
      @edit="openModal('personal')"
    />

    <ProfileEditModal
      v-if="showModal"
      :section="activeSection"
      @close="closeModal"
    />
  </div>
</template>

<script>
export default {
  name: "Profile",
  components: {
    ProfileCardHorizontal: () =>
      import("../components/ProfileCardHorizontal.vue"),
    ProfileCardPersonalInformation: () =>
      import("../components/ProfileCardPersonalInformation.vue"),
    ProfileEditModal: () => import("../components/ProfileEditModal.vue"),
  },
  data() {
    return {
      showModal: false,
      activeSection: null,
    };
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
