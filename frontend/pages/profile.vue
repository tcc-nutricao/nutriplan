<template>
  <div>
    <ProfileCardHorizontal nome="Luna Araújo" email="luna@gmail.com" />
    <ProfileCardPersonalInformation
      :idade="15"
      sexo="Feminino"
      :altura="165"
      :peso="65"
      restricoes="Sem glúten"
      objetivo="Ganhar massa muscular"
      preferencias="Dieta mediterrânea"
    />
  </div>
</template>

<script> 

export default {
  name: 'Profile',
  components: {
    ProfileCardHorizontal: () => import('../components/ProfileCardHorizontal.vue'),
    ProfileCardPersonalInformation: () => import('../components/ProfileCardPersonalInformation.vue'),
  },
};

</script>