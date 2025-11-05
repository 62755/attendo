<script>
export default {
    name: 'TableComponent',
    props: {
        headers: Array,
        items: Array,
        fields: Array,
        presentStudents: Object,
        isStudentTable: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        /**
         * Gère le clic sur une ligne du tableau.
         * - Si le tableau concerne des étudiants, on déclenche `togglePresence`.
         * - Sinon, si l'élément contient une route, on redirige l'utilisateur.
         *
         * @param {Object} item - Élément de la ligne du tableau.
         */
        handleClick(item) {
            if (this.isStudentTable && item.student_id) {
                this.$emit('togglePresence', item);
            } else if (item.route) {
                this.$router.push(item.route);
            }
        },
    },
}
</script>

<template>
    <table class="table-auto w-full border mt-4">
        <thead>
            <tr class="bg-gray-200">
                <th v-for="header in headers" :key="header" class="px-4 py-2 text-left">
                {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(item, index) in items"
                :key="index"
                :class="[
                'border-t hover:bg-gray-100 cursor-pointer',
                isStudentTable && presentStudents?.has(item.student_id) ? 'bg-blue-200 text-white' : '',
                ]"
                @click="handleClick(item)"
                >
                <td
                    v-for="field in fields"
                    :key="field"
                    class="px-4 py-2 hover:underline text-blue-400"
                >
                    {{ item[field] }}
                </td>
            </tr>
        </tbody>
    </table>
</template>
