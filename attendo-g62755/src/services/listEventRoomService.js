import { supabase } from '@/lib/supabaseClient'

/**
 * Récupère la liste des locaux disponibles pour une épreuve donnée.
 * Exclut les locaux déjà utilisés pour l'événement.
 *
 * @param {number} eventId - L'ID de l'événement.
 * @returns {Promise<Array>} Un tableau contenant les locaux disponibles.
 */
export async function fetchAvailableEventRooms(eventId) {
    const { data: usedRooms, error: usedRoomsError } = await supabase
        .from('examination_room')
        .select('room')
        .eq('event', eventId)

    if (usedRoomsError) {
        console.error('Erreur récupération des locaux déjà utilisés :', usedRoomsError)
        return []
    }

    const usedRoomLabels = usedRooms.map(r => r.room)

    let query = supabase
        .from('room')
        .select('*')
        .order('label', { ascending: true })

    if (usedRoomLabels.length > 0) {
        // Exclut les locaux déjà utilisés
        query = query.not('label', 'in', `(${usedRoomLabels.map(l => `'${l}'`).join(',')})`)
    }

    const { data, error } = await query

    if (error) {
        console.error('Erreur lors de la récupération des locaux disponibles :', error)
        return []
    }

    return data
}

/**
 * Associe un local à une épreuve.
 *
 * @param {number} epreuveId - L'ID de l'épreuve.
 * @param {string} roomLabel - Le label du local à ajouter.
 * @returns {Promise<Object|null>} Données du local ajouté ou `null` en cas d'erreur.
 */
export async function addEventRoomToEpreuve(epreuveId, roomLabel) {
    const { data, error } = await supabase
        .from('examination_room')
        .insert([
            {
                event: epreuveId,
                room: roomLabel,
            }
        ])

    if (error) {
        console.error('Erreur lors de l\'ajout du local à l\'épreuve :', error)
        return null
    }

    return data
}

/**
 * Récupère la liste des locaux associés à une épreuve, avec leur capacité et leur surveillant.
 *
 * @param {number} epreuveId - L'ID de l'épreuve.
 * @returns {Promise<Array>} Liste des locaux avec leurs infos.
 */
export async function fetchRoomsForEvent(epreuveId) {
    const { data, error } = await supabase
        .from('examination_room')
        .select('room(label, capacity), supervisor(acro)')
        .eq('event', epreuveId)

    if (error) {
        console.error('Erreur lors de la récupération des locaux associés à l\'épreuve :', error)
        return []
    }

    return data.map(item => ({
        label: item.room.label,
        capacity: item.room.capacity,
        teacher: item.supervisor?.acro || 'N/A'
    }))
}

/**
 * Récupère le label d'une épreuve spécifique.
 *
 * @param {number} eventId - L'ID de l'épreuve.
 * @returns {Promise<string|null>} Le label de l'épreuve ou `null` en cas d'erreur.
 */
export async function fetchEventLabel(eventId) {
    const { data, error } = await supabase
        .from('event')
        .select('label')
        .eq('id', eventId)
        .single()

    if (error) {
        console.error("Erreur récupération du label de l'épreuve :", error)
        return null
    }

    return data?.label || null
}

/**
 * Récupère le label d'une UE spécifique.
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
        console.error("Erreur récupération du label de l'UE :", error)
        return null
    }

    return data?.ue || null
}
