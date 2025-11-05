import { defineStore } from 'pinia';
import { supabase } from '../lib/supabaseClient';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
    }),
    actions: {
        /**
         * Initialise l'état d'authentification.
         * Vérifie si l'URL contient un token de connexion et tente de le définir via Supabase.
         * Ensuite, récupère la session actuelle et met à jour user.
         */
        async init() {
            const hash = window.location.hash;
            
            if (hash.includes('access_token')) {
                const queryParams = new URLSearchParams(hash.slice(1));
                const accessToken = queryParams.get('access_token');
                const refreshToken = queryParams.get('refresh_token');
                
                if (accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                    if (error) {
                        console.error('Erreur setSession :', error);
                    }
                }
            }
            
            const { data, error } = await supabase.auth.getSession();
            this.user = data?.session?.user || null;
            
            if (error) {
                console.error('Erreur getSession :', error);
            }
            
            // Écoute les changements de session et met à jour user dynamiquement
            supabase.auth.onAuthStateChange((event, session) => {
                this.user = session?.user || null;
            });
        },
        
        /**
         * Lance l'authentification via OAuth (Google).
         * Redirige l'utilisateur après connexion.
         */
        async login() {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin },
            });
            if (error) {
                console.error('[AuthStore:login] Erreur :', error);
            }
        },
        
        /**
         * Déconnecte l'utilisateur et nettoie l'état de session.
         * Redirige vers la page d'accueil après déconnexion.
         */
        async logout() {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('[AuthStore:logout] Erreur :', error);
            }
            this.user = null;
            window.location.href = '/';
        },
    },
});
