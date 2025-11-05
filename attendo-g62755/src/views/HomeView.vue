<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'HomeView',
  computed: {
    ...mapStores(useAuthStore)
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Accueil</h1>
    <div v-if="authStore.user !== null">
      <p class="text-lg">Bonjour, {{ authStore.user.email }}</p>
    </div>
    <div v-else>
      <p class="text-lg">Bienvenue, veuillez vous connecter pour plus de contenu !</p>
    </div>
  </div>
</template>
