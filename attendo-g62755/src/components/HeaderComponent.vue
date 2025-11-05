<script>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { mapStores } from 'pinia'

export default {
    name: 'HeaderComponent',
    components: {
        RouterLink,
    },
    computed: {
    ...mapStores(useAuthStore)
    },
    methods: {
        /**
         * Gestion du clic sur le bouton d'authentification.
         * - Si l'utilisateur est connecté, il est déconnecté.
         * - Sinon, il est redirigé vers l'authentification Google.
         */
        handleClick() {
            if (this.authStore.user) {
                this.authStore.logout()
            } else {
                this.authStore.login()
            }
        }
    }
}
</script>

<template>
    <div class="w-full">
        <div class="bg-black py-6 text-center">
            <h1 class="text-3xl font-bold text-fuchsia-600">Attendo</h1>
        </div>

        <div class="bg-gray-100 flex justify-between items-center px-8 py-3 w-full">
            <div class="flex gap-6">
                <RouterLink to="/" class="text-gray-800 hover:text-pink-500 transition-colors">Accueil</RouterLink>
                <RouterLink to="/sessions" class="text-gray-800 hover:text-pink-500 transition-colors">Sessions</RouterLink>
                <RouterLink to="/about" class="text-gray-800 hover:text-pink-500 transition-colors">À propos</RouterLink>
            </div>

            <button
                class="bg-white border border-gray-300 rounded px-4 py-2 hover:bg-gray-200 transition-colors"
                @click="handleClick"
                >
                {{ authStore.user ? 'Déconnexion' : 'Connexion avec Google' }}
            </button>

        </div>
    </div>
</template>
