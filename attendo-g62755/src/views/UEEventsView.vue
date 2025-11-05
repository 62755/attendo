<script>
import { useRoute } from 'vue-router'
import { ref, onMounted, watch, computed } from 'vue'
import { fetchUeEpreuves, addEventToSessionCompo, fetchUELabel, fetchSessionLabel, fetchSessionCompoId } from '@/services/listUEEventsService'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import TableComponent from '@/components/TableComponent.vue'

export default {
    name: 'UEEventsView',
    components: { BreadcrumbComponent, TableComponent },
    setup() {
        const route = useRoute()
        const ueId = route.params.ueId
        const sessionId = route.params.sessionId
        const ueLabel = ref('')
        const sessionLabel = ref('')
        const epreuves = ref([])
        const newEpreuveLabel = ref('')
        const errorMessage = ref('')

        const tableHeaders = ["Épreuve"];
        const tableFields = ['label'];

        /**
         * Récupère le label de l'UE.
         */
        const fetchUe = async () => {
            const label = await fetchUELabel(ueId)
            if (label) {
                ueLabel.value = label
            }
        }

        /**
         * Récupère le label de la session.
         */
        const fetchSession = async () => {
            const label = await fetchSessionLabel(sessionId)
            if (label) {
                sessionLabel.value = label
            }
        }

        /**
         * Récupère les épreuves associées à une UE pour la session donnée.
         */
        const loadEpreuves = async () => {
            const sessionCompoId = await fetchSessionCompoId(ueId, sessionId);
            if (!sessionCompoId) {
                console.error("Impossible de trouver session_compo.id pour ueId :", ueId);
                return;
            }

            epreuves.value = await fetchUeEpreuves(sessionCompoId);
        };

        /**
         * Ajoute une nouvelle épreuve à la session de l'UE.
         */
        const handleAddEpreuve = async () => {
            if (newEpreuveLabel.value.trim() === '') {
                errorMessage.value = "Veuillez entrer un nom pour l'épreuve";
                return;
            } else {
                const sessionCompoId = await fetchSessionCompoId(ueId, sessionId);
                if (!sessionCompoId) {
                    console.error("Impossible de récupérer session_compo.id pour ueId :", ueId);
                    return;
                }

                await addEventToSessionCompo(sessionCompoId, newEpreuveLabel.value);
                newEpreuveLabel.value = '';
                loadEpreuves();
            }
        }

        const epreuvesTableRoutes = computed(() => {
            return epreuves.value.map(epreuve => ({
                ...epreuve,
                route: { name: 'eventRoomView', params: { sessionId, ueId, eventId: epreuve.id } }
            }));
        });

        // Exécute les fonctions au montage du composant pour récupérer les données initiales.
        onMounted(() => {
            fetchUe()
            fetchSession()
            loadEpreuves()
        })

        // Surveille les changements d'URL pour recharger les données si l'utilisateur navigue.
        watch(() => route.fullPath, () => {
            fetchUe()
            fetchSession()
            loadEpreuves()
        })

        return { ueLabel, sessionLabel, epreuves, newEpreuveLabel, handleAddEpreuve, errorMessage, tableHeaders, tableFields, epreuvesTableRoutes }
    }
}
</script>

<template>
    <div class="p-6">
        <BreadcrumbComponent />
        <h1 class="text-2xl font-bold text-blue-400">Épreuves de l'UE {{ ueLabel }} (Session : {{ sessionLabel }})</h1>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="mb-6">
            <label for="epreuveLabel" class="block text-lg font-medium mb-2">Ajouter une épreuve</label>
        
            <input
                v-model="newEpreuveLabel"
                type="text"
                id="epreuveLabel"
                class="border p-2 w-full max-w-md rounded"
                placeholder="Entrez le nom de l'épreuve (ex : bilan, projet, examen, etc)"
            />
            
            <button
                @click="handleAddEpreuve"
                class="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700"
            >
            Ajouter l'épreuve
            </button>

            <div v-if="errorMessage" class="text-red-600 mt-2">
                {{ errorMessage }}
            </div>
        </div>

        <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <router-link
                v-for="epreuve in epreuves"
                :key="epreuve.id"
                :to="{ name: 'eventRoomView', params: { sessionId, ueId, eventId: epreuve.id } }"
                class="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center justify-center text-center h-40 hover:bg-gray-200 transition cursor-pointer"
                >
                <p class="text-lg font-semibold text-gray-800">{{ epreuve.label }}</p>
            </router-link>
        </div> -->
        <h2 class="text-lg font-semibold mt-6">Liste des épreuves</h2>
        <TableComponent
            :headers="tableHeaders"
            :items="epreuvesTableRoutes"
            :fields="tableFields"
            :isStudentTable="false"
        />
    </div>
</template>