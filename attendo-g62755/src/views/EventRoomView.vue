<script>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { fetchRoomsForEvent, fetchAvailableEventRooms, addEventRoomToEpreuve, fetchEventLabel, fetchUELabel } from '@/services/listEventRoomService';
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue';

export default {
    name: 'RoomEventView',
    components: { BreadcrumbComponent },
    setup() {
        const route = useRoute();
        const eventId = route.params.eventId;
        const ueId = route.params.ueId;

        const allocatedRooms = ref([]);
        const availableRooms = ref([]);
        const selectedRoom = ref(null);
        const errorMessage = ref(null);
        const eventLabel = ref('');
        const ueLabel = ref('');

        /**
         * Récupère les labels d'une épreuve et d'une UE associée.
         */
        const fetchEventDetails = async () => {
            const label = await fetchEventLabel(eventId)
            if (label) {
                eventLabel.value = label
            }

            const ue = await fetchUELabel(ueId)
            if (ue) {
                ueLabel.value = ue
            }
        };

        /**
         * Charge la liste des locaux assignés et disponibles (non attribués).
         */
        const loadRooms = async () => {
            allocatedRooms.value = await fetchRoomsForEvent(eventId);
            availableRooms.value = await fetchAvailableEventRooms(eventId)

            availableRooms.value = availableRooms.value.filter(room =>
                !allocatedRooms.value.some(allocatedRoom => allocatedRoom.label === room.label)
            );
        };

        /**
         * Ajoute un local à l'épreuve.
         */
        const handleAddRoom = async () => {
            if (!selectedRoom.value) {
                errorMessage.value = 'Veuillez sélectionner un local à ajouter';
                return;
            }

            await addEventRoomToEpreuve(eventId, selectedRoom.value);
            selectedRoom.value = null;
            loadRooms();
        };

        // Exécute le chargement initial au montage du composant.
        onMounted(() => {
            fetchEventDetails();
            loadRooms();
        });

        // Surveille les changements d'URL pour recharger les données si l'utilisateur navigue.
        watch(() => route.fullPath, () => {
            fetchEventDetails();
            loadRooms();
        });


        return { allocatedRooms, availableRooms, selectedRoom, handleAddRoom, errorMessage, eventLabel, ueLabel };
    }
};
</script>

<template>
    <div class="p-6">
        <BreadcrumbComponent />
        <h1 class="text-2xl font-bold text-blue-400">Locaux pour l'épreuve {{ eventLabel }} - {{ ueLabel }}</h1>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="mb-6">
            <label for="roomLabel" class="block text-lg font-medium mb-2">Ajouter un local</label>
            <select v-model="selectedRoom" id="roomLabel" class="border p-2 w-full max-w-md rounded">
                <option value="" disabled>Sélectionner un local</option>
                <option v-for="room in availableRooms" :key="room.label" :value="room.label">{{ room.label }}</option>
            </select>
            
            <button
                @click="handleAddRoom"
                class="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700"
            >
            Ajouter le local
            </button>

            <div v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <router-link
                v-for="room in allocatedRooms"
                :key="room.label"
                :to="{ name: 'presenceView', params: { sessionId, ueId, eventId, roomId: room.label } }"
                class="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center justify-center text-center h-40 cursor-pointer"
            >
                <p class="text-lg font-semibold text-gray-800">{{ room.label }}</p>
                <p class="text-sm text-gray-500">Capacité : {{ room.capacity }}</p>
                <p class="text-sm text-gray-400">Surveillant : {{ room.teacher }}</p>
            </router-link>
        </div>
    </div>
</template>
