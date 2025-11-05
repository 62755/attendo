import { supabase } from '@/lib/supabaseClient';

/**
 * Récupère toutes les sessions disponibles.
 *
 * @returns {Promise<Array>} Un tableau contenant les sessions.
 * @throws {Error} En cas d'échec de la récupération des données.
 */
export async function fetchSessions() {
    const { data, error } = await supabase.from('session').select('*');
    
    if (error) {
        throw error;
    } else {
        return data;
    }
}

/**
 * Ajoute une nouvelle session.
 *
 * @param {Object} session - L'objet représentant la session à ajouter.
 * @returns {Promise<Object>} Les données de la session ajoutée.
 * @throws {Error} En cas d'échec de l'ajout de la session.
 */
export async function addSession(session) {
    const { data, error } = await supabase.from('session').insert([session]);

    if (error) {
        throw error;
    } else {
        return data;
    }
}