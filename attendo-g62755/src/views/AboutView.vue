<script>
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

export default {
  name: 'AboutView',
  components: { BreadcrumbComponent}
}
</script>

<template>
  <div class="p-6">
    <BreadcrumbComponent />
    <h1 class="text-2xl font-bold mb-4">À propos</h1>
    
    <ul class="list-disc list-inside space-y-2 text-lg">
      <li><strong>Auteur : </strong>Moussa Adam</li>
      <li><strong>Année scolaire : </strong>2024-2025</li>
      <li><strong>Technologies utilisées : </strong>
        <ul class="list-disc list-inside ml-6 mt-1 text-base">
          <li>VueJS</li>
          <li>Vite</li>
          <li>Vue-Router</li>
          <li>Tailwind CSS</li>
          <li>Pinia</li>
          <li>Supabase</li>
        </ul>
      </li>
    </ul>
  </div>
</template>