import { supabase } from '@/lib/supabaseClient'

/**
 * Récupère toutes les UEs disponibles dans la base de données.
 *
 * @returns {Promise<Array>} Un tableau contenant les unités d’enseignement.
 * @throws {Error} En cas d'échec de la récupération des données.
 */
export async function fetchAllUEs() {
    const { data, error } = await supabase
        .from('ue')
        .select('ue')

    if (error) {
        throw error
    } else {
        return data
    }
}

/**
 * Récupère les UEs associées à une session spécifique.
 *
 * @param {number} sessionId - L'ID de la session.
 * @returns {Promise<Array>} Un tableau contenant les UEs associées à la session.
 * @throws {Error} En cas d'échec de la récupération des données.
 */
export async function fetchSessionUEs(sessionId) {
    const { data, error } = await supabase
        .from('session_compo')
        .select('ue')
        .eq('session', sessionId)

    if (error) {
        throw error
    } else {
        return data.map(item => ({ ue: item.ue }))
    }
}

/**
 * Ajoute une UE à une session spécifique.
 *
 * @param {number} sessionId - L'ID de la session.
 * @param {string} ueLabel - Le label de l'UE à ajouter.
 * @returns {Promise<Object>} Les données de la session mise à jour.
 * @throws {Error} En cas d'échec de l'ajout de l'UE.
 */
export async function addUEToSession(sessionId, ueLabel) {
    const { data, error } = await supabase
        .from('session_compo')
        .insert([{ session: sessionId, ue: ueLabel }])

    if (error) {
        throw error
    } else {
        return data
    }
}

/**
 * Récupère le label d'une session spécifique.
 *
 * @param {number} sessionId - L'ID de la session.
 * @returns {Promise<string|null>} Le label de la session, ou `null` si la session n'existe pas.
 * @throws {Error} En cas d'échec de la récupération.
 */
export async function fetchSessionLabel(sessionId) {
    const { data, error } = await supabase
        .from('session')
        .select('label')
        .eq('id', sessionId)
        .single();

    if (error || !data) {
        console.error('Erreur chargement session :', error);
        return null;
    }

    return data.label;
}
