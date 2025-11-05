<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { fetchSessions, addSession } from '@/services/listSessionsService'
import TableComponent from '@/components/TableComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

export default {
    name: 'SessionsView',
    components: { TableComponent, BreadcrumbComponent },
    computed: {
        ...mapStores(useAuthStore)
    },
    data() {
        return {
            sessions: [],
            newSessionName: '',
            errorMessage: '',
            tableHeaders: ['Sessions'],
            tableAttrs: ['label'],
        }
    },
    async mounted() {
        if (!this.authStore.user) {
            this.$router.push('/'); // Redirection vers la page d'accueil si l'utilisateur n'est pas connecté
        } else {
            await this.loadSessions() // Charge les sessions si l'utilisateur est authentifié
        }
    },
    methods: {
        /**
         * Récupère les sessions depuis la base de données.
         */
        async loadSessions() {
            try {
                const sessions = await fetchSessions();
                this.sessions = sessions.map(session => ({
                    ...session,
                    route: `/sessions/${session.id}` // Ajoute une route dynamique vers chaque session
                }));
            } catch (error) {
                console.error('Erreur lors du chargement des sessions :', error);
            }
        },
        /**
         * Ajoute une nouvelle session après validation du champ.
         * En cas de succès, la liste des sessions est rechargée.
         */
        async handleAddSession() {
            if (this.newSessionName.trim() === '') {
                this.errorMessage = "Veuillez entrer un nom pour la session";
                return;
            } else {
                try {
                    await addSession({ label: this.newSessionName });
                    this.newSessionName = '';
                    await this.loadSessions();
                } catch (error) {
                    console.error('Erreur lors de l’ajout de la session :', error);
                }
            }
        }
    }
}
</script>

<template>
    <div class="p-6">
        <BreadcrumbComponent />
        <h1 class="text-2xl font-bold">Sessions</h1>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
        <label for="sessionName" class="block text-lg font-medium mb-2">Nom</label>
        <input
            v-model="newSessionName"
            type="text"
            id="sessionName"
            class="border p-2 w-full max-w-md rounded"
            placeholder="Entrez le nom de la session"
        />
        <button
            @click="handleAddSession"
            class="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700"
        >
            Ajouter
        </button>

        <div v-if="errorMessage" class="text-red-600 mt-2">
            {{ errorMessage }}
        </div>

        <TableComponent
            :headers="tableHeaders"
            :items="sessions"
            :fields="tableAttrs"
        />
    </div>
</template>
