<script>
export default {
    name: 'BreadcrumbComponent',
    computed: {
        /**
         * Récupère le fil d'Ariane défini dans meta.breadcrumb des routes.
         * Si aucune donnée n'est disponible, retourne un tableau vide.
         */
        breadcrumb() {
            return this.$route.meta.breadcrumb || []
        }
    },
    methods: {
        /**
         * Génère le chemin correspondant à chaque élément du fil d'Ariane.
         * Il reconstruit dynamiquement l'URL en fonction des segments de la route actuelle.
         *
         * @param {number} index - L'index du breadcrumb.
         * @returns {string} - Le chemin généré pour chaque élément.
         */
        getBreadcrumbPath(index) {
            return '/' + this.$route.path.split('/').slice(1, index + 1).join('/');
        }
    }
}
</script>


<template>
    <nav class="text-sm text-blue-400 mb-4" v-if="breadcrumb && breadcrumb.length">
        <ul class="flex space-x-1">
            <li v-for="(crumb, index) in breadcrumb" :key="index">
                <router-link
                    v-if="index !== breadcrumb.length - 1"
                    :to="getBreadcrumbPath(index)"
                    class="hover:underline text-blue-500"
                >
                    {{ crumb }}
                </router-link>
                <span v-else class="font-semibold">{{ crumb }}</span>
                <span v-if="index !== breadcrumb.length - 1"> > </span>
            </li>
        </ul>
    </nav>
</template>