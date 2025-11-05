import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import UEEventsView from '../views/UEEventsView.vue'
import AboutView from '../views/AboutView.vue'
import EventRoomView from '../views/EventRoomView.vue'
import PresenceView from '../views/PresenceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { breadcrumb: ['Accueil'] }
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView,
      meta: { breadcrumb: ['Accueil', 'Sessions'] }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { breadcrumb: ['Accueil', 'À propos'] }
    },
    {
      path: '/sessions/:id',
      name: 'sessionDetail',
      component: SessionDetailView,
      meta: { breadcrumb: ['Accueil', 'Sessions', 'Détail de session'] }
    },
    {
      path: '/sessions/:sessionId/:ueId',
      name: 'ueEvents',
      component: UEEventsView,
      meta: { breadcrumb: ['Accueil', 'Sessions', 'Détail de session', 'Détail de l\'UE'] }
    },
    {
      path: '/sessions/:sessionId/:ueId/:eventId',
      name: 'eventRoomView',
      component: EventRoomView,
      meta: { breadcrumb: ['Accueil', 'Sessions', 'Détail de session', 'Détail de l\'UE', 'Épreuve'] }
    },
    {
      path: '/sessions/:sessionId/:ueId/:eventId/:roomId',
      name: 'presenceView',
      component: PresenceView,
      meta: { breadcrumb: ['Accueil', 'Sessions', 'Détail de session', 'Détail de l\'UE', 'Épreuve', 'Local'] }
    }
  ],
})

export default router
