import { supabase } from '@/lib/supabaseClient'

/**
 * Récupère les épreuves associées à une session spécifique.
 *
 * @param {number} sessionCompoId - L'ID de la session_compo.
 * @returns {Promise<Array>} Liste des épreuves associées à cette session.
 */
export async function fetchUeEpreuves(sessionCompoId) {
    const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('session_compo', sessionCompoId)

    if (error) {
        console.error("Erreur lors de la récupération des épreuves : ", error)
        return []
    }
    return data
}

/**
 * Ajoute une nouvelle épreuve à une session spécifique.
 *
 * @param {number} sessionCompoId - L'ID de la session_compo.
 * @param {string} label - Le nom de l'épreuve.
 * @returns {Promise<Object|null>} Données de l'épreuve ajoutée ou `null` en cas d'erreur.
 */
export async function addEventToSessionCompo(sessionCompoId, label) {
    const { data, error } = await supabase
        .from('event')
        .insert([
        {
            session_compo: sessionCompoId,
            label: label,
            completed: false,
        }
        ])

    if (error) {
        console.error("Erreur lors de l'ajout de l'épreuve : ", error)
        return null
    }
    return data
}

/**
 * Récupère le label d'une UE.
 *
 * @param {number} ueId - L'ID de l'UE.
 * @returns {Promise<string|null>} Le label de l'UE ou `null` en cas d'erreur.
 */
export async function fetchUELabel(ueId) {
    const { data, error } = await supabase
        .from('ue')
        .select('ue')
        .eq('ue', ueId)
        .single()

    if (error) {
        console.error("Erreur lors du chargement de l'UE :", error)
        return null
    }
    return data?.ue || null
}

/**
 * Récupère le label d'une session.
 *
 * @param {number} sessionId - L'ID de la session.
 * @returns {Promise<string|null>} Le label de la session ou `null` en cas d'erreur.
 */
export async function fetchSessionLabel(sessionId) {
    const { data, error } = await supabase
        .from('session')
        .select('label')
        .eq('id', sessionId)
        .single()

    if (error) {
        console.error("Erreur lors du chargement de la session :", error)
        return null
    }
    return data?.label || null
}

/**
 * Récupère l'ID de la session_compo correspondant à une UE et une session données.
 *
 * @param {number} ueId - L'ID de l'UE.
 * @param {number} sessionId - L'ID de la session.
 * @returns {Promise<number|null>} L'ID de la session_compo ou `null` en cas d'erreur.
 */
export async function fetchSessionCompoId(ueId, sessionId) {
    const { data, error } = await supabase
        .from('session_compo')
        .select('id')
        .eq('ue', ueId)
        .eq('session', sessionId)
        .single()

    if (error) {
        console.error("Erreur récupération session_compo ID :", error)
        return null
    }
    return data?.id || null
}
