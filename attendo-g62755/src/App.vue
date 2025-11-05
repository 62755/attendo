<script>
import HeaderComponent from './components/HeaderComponent.vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    RouterView,
  },
  created() {
    // Initialise l'authentification dès le chargement de l'application
    useAuthStore().init()
  }
}
</script>

<template>
  <HeaderComponent />
  <RouterView />
</template>