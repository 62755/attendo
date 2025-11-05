<script>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { fetchAllUEs, fetchSessionUEs, addUEToSession, fetchSessionLabel } from '@/services/listUEService'
import TableComponent from '@/components/TableComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

export default {
    name: 'SessionDetailView',
    components: { TableComponent, BreadcrumbComponent },
    setup() {
        const route = useRoute();
        const sessionLabel = ref('');
        const sessionId = route.params.id;
        const allUEs = ref([])
        const uesAssociees = ref([])
        const uesNonAssociees = ref([])
        const selectedUE = ref(null)
        const errorMessage = ref(null)
        const tableHeaders = ['UE']
        const tableFields = ['ue']
        
        /**
         * Récupère le label de la session et l'assigne à sessionLabel.
         */
        const fetchSession = async () => {
            const label = await fetchSessionLabel(sessionId);
            if (label) {
                sessionLabel.value = label;
            }
        };

        /**
         * Charge la liste complète des UEs puis appelle loadSessionUEs().
         */
        const loadUEs = async () => {
            try {
                allUEs.value = await fetchAllUEs()
                loadSessionUEs()
            } catch (error) {
                console.error('Erreur lors du chargement des UE :', error);
            }
        }

        /**
         * Charge les UEs associées à la session et met à jour uesAssociees et uesNonAssociees.
         */
        const loadSessionUEs = async () => {
            try {
                const data = await fetchSessionUEs(sessionId);
                uesAssociees.value = data.map(ue => ({
                    ...ue,
                    route: `/sessions/${sessionId}/${ue.ue}` // Génère un lien dynamique pour chaque UE associée
                }))

                // Filtre les UEs non associées en comparant avec celles déjà présentes
                uesNonAssociees.value = allUEs.value.filter(ue =>
                    !uesAssociees.value.some(associatedUE => associatedUE.ue === ue.ue)
                );
            } catch (error) {
                console.error('Erreur lors du chargement des UE associées à une session :', error);
            }
        }

        /**
         * Ajoute une UE à la session.
         */
        const handleAddUE = async () => {
            if (!selectedUE.value) {
                errorMessage.value = 'Veuillez sélectionner une UE à ajouter'
                return
            }

            try {
                await addUEToSession(sessionId, selectedUE.value)
                errorMessage.value = null
                loadSessionUEs()
            } catch (error) {
                console.error('Erreur lors de l\'ajout de l\'UE :', error);
            }
        }

        // Exécute le chargement des données lors du montage du composant.
        onMounted(() => {
            fetchSession(),
            loadUEs();
        });

        return { sessionLabel, uesNonAssociees, selectedUE, handleAddUE, uesAssociees, errorMessage, tableHeaders, tableFields };
    }
}
</script>

<template>
    <div class="p-6">
        <BreadcrumbComponent />
        <h1 class="text-2xl font-bold text-blue-400">Session de {{ sessionLabel }}</h1>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
        <label for="ue" class="block text-lg font-medium mb-2">Sélectionnez une UE à ajouter</label>
        <select v-model="selectedUE" id="ue" class="border p-2 w-full max-w-md rounded">
            <option value="" disabled>Sélectionner une UE</option>
            <option v-for="ue in uesNonAssociees" :key="ue.ue" :value="ue.ue">{{ ue.ue }}</option>
        </select>

        <button @click="handleAddUE" class="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700 mt-4">
                Ajouter l'UE
        </button>

        <div v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</div>

        <TableComponent
            :headers="tableHeaders"
            :items="uesAssociees"
            :fields="tableFields"
        />
    </div>
</template>
