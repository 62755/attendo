<script>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { fetchAllStudents, fetchStudentsByUE, updateSupervisor, fetchSupervisors, togglePresence, fetchPresencesByRoom, fetchRoomSupervisor } from '@/services/listPresenceService';
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue';
import TableComponent from '@/components/TableComponent.vue';

export default {
    name: 'PresenceView',
    components: { BreadcrumbComponent, TableComponent },
    setup() {
        const route = useRoute();
        const roomId = route.params.roomId;
        
        const students = ref([]);
        const presentStudents = ref(new Set());
        const selectedTeacher = ref(null);
        const supervisors = ref([]);
        const supervisorAcro = ref('');
        const roomLabel = roomId;
        const ueId = route.params.ueId;
        const errorMessage = ref('');

        /**
         * Charge tous les étudiants et filtre ceux inscrits à l'UE donnée.
         */
        const loadStudents = async () => {
            const allStudents = await fetchAllStudents();
            const studentsByUE = await fetchStudentsByUE(ueId);

            students.value = allStudents.filter(student =>
                studentsByUE.some(enrolled => enrolled.student_id === student.student_id)
            );
        };

        /**
         * Charge la liste des surveillants.
         */
        const loadSupervisors = async () => {
            supervisors.value = await fetchSupervisors();
        };

        /**
         * Met à jour le surveillant du local.
         */
        const handleSupervisorChange = async () => {
            if (!selectedTeacher.value) {
                errorMessage.value = "Veuillez sélectionner un surveillant.";
                return;
            } else {
                await updateSupervisor(roomId, selectedTeacher.value);
                await loadRoomSupervisor();
                errorMessage.value = null
            }
        };

        /**
         * Charge le surveillant actuellement attribué au local.
         */
        const loadRoomSupervisor = async () => {
            supervisorAcro.value = await fetchRoomSupervisor(roomId);
        };

        /**
         * Marque ou supprime la présence d'un étudiant dans le local.
         * Supprime l'étudiant s'il est déjà présent, sinon l'ajoute.
         */
        const handlePresenceToggle = async (student) => {
            await togglePresence(student.student_id, roomId);
            
            if (presentStudents.value.has(student.student_id)) {
                presentStudents.value.delete(student.student_id);
            } else {
                presentStudents.value.add(student.student_id);
            }
        };

        /**
         * Charge la liste des étudiants présents dans le local.
         */
        const loadPresences = async () => {
            const presentStudentIds = await fetchPresencesByRoom(roomId);
            presentStudents.value = new Set(presentStudentIds);
        };

        // Charge les données lors du montage du composant.
        onMounted(() => {
            loadStudents();
            loadSupervisors();
            loadRoomSupervisor();
            loadPresences();
            loadRoomSupervisor();
        });

        return {
            students,
            selectedTeacher,
            supervisors,
            handlePresenceToggle,
            handleSupervisorChange,
            tableHeaders: ["Matricule", "Prénom", "Nom"],
            tableFields: ["student_id", "firstname", "lastname"],
            roomLabel,
            supervisorAcro,
            presentStudents,
            errorMessage
        };
    }
};
</script>

<template>
    <div class="p-6">
        <BreadcrumbComponent />
        <h1 class="text-2xl font-bold text-blue-400">Prise de présence du local {{ roomLabel }} par {{ supervisorAcro }}</h1>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="mb-6">
            <h2 class="text-lg font-semibold">Surveillant</h2>
            <select v-model="selectedTeacher" class="border p-2 w-full max-w-md rounded">
                <option value="" disabled>Sélectionner un surveillant</option>
                <option v-for="teacher in supervisors" :key="teacher.acro" :value="teacher.acro">
                    {{ teacher.acro }}
                </option>
            </select>

            <button @click="handleSupervisorChange" class="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700 mt-4">
                Modifier le surveillant
            </button>

            <div v-if="errorMessage" class="text-red-600 mt-2">
                {{ errorMessage }}
            </div>
        </div>

        <h2 class="text-lg font-semibold mt-6">Liste des étudiants</h2>
        <TableComponent
            :headers="tableHeaders"
            :items="students"
            :fields="tableFields"
            :presentStudents="presentStudents"
            :isStudentTable="true"
            @togglePresence="handlePresenceToggle"
        >
        </TableComponent>
    </div>
</template>
