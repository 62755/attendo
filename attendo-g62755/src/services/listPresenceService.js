import { supabase } from '@/lib/supabaseClient';

/**
 * Récupère la liste de tous les étudiants.
 *
 * @returns {Promise<Array>} Un tableau contenant les étudiants avec leur ID, prénom et nom.
 */
export async function fetchAllStudents() {
    const { data, error } = await supabase
        .from('student')
        .select('student_id, firstname, lastname');
        
    if (error) {
        console.error('Erreur récupération étudiants:', error);
        return [];
    }
    
    return data;
}

/**
 * Récupère les étudiants inscrits à une UE spécifique.
 *
 * @param {number} ueId - L'ID de l'unité d'enseignement.
 * @returns {Promise<Array>} Un tableau contenant les étudiants inscrits à l'UE.
 */
export async function fetchStudentsByUE(ueId) {
    const { data, error } = await supabase
        .from('pae')
        .select('student_id, student:student(student_id, firstname, lastname)')
        .eq('ue', ueId);

    if (error) {
        console.error('Erreur récupération étudiants inscrits à l\'UE:', error);
        return [];
    }

    return data;
}

/**
 * Récupère la liste des surveillants.
 *
 * @returns {Promise<Array>} Un tableau contenant les surveillants avec leur acronyme et nom.
 */
export async function fetchSupervisors() {
    const { data, error } = await supabase
        .from('teacher')
        .select('acro, names');
        
    if (error) {
        console.error('Erreur récupération surveillants :', error);
        return [];
    }

    return data;
}

/**
 * Récupère le surveillant d'une salle d'examen.
 *
 * @param {string} roomId - L'ID de la salle d'examen.
 * @returns {Promise<string|null>} L'acronyme du surveillant ou `null` en cas d'erreur.
 */
export async function fetchRoomSupervisor(roomId) {
    const { data, error } = await supabase
        .from('examination_room')
        .select('supervisor, teacher:supervisor(acro)')
        .eq('room', roomId)
        .single();

    if (error) {
        console.error('Erreur récupération du surveillant:', error);
        return null;
    }

    return data?.teacher?.acro || null;
}

/**
 * Met à jour le surveillant d'une salle d'examen.
 *
 * @param {string} roomId - L'ID de la salle d'examen.
 * @param {string} teacherAcro - L'acronyme du surveillant à assigner.
 * @returns {Promise<void>}
 */
export async function updateSupervisor(roomId, teacherAcro) {
    const { error } = await supabase
        .from('examination_room')
        .update({ supervisor: teacherAcro })
        .eq('room', roomId);

    if (error) {
        console.error('Erreur mise à jour surveillant:', error);
    }
}

/**
 * Active ou désactive la présence d'un étudiant dans une salle d'examen.
 *
 * @param {number} studentId - L'ID de l'étudiant.
 * @param {string} roomCode - Le code de la salle d'examen.
 * @returns {Promise<void>}
 */
export async function togglePresence(studentId, roomCode) {
    const { data: roomData, error: roomError } = await supabase
        .from('examination_room')
        .select('id')
        .eq('room', roomCode)
        .single();

    if (roomError || !roomData) {
        console.error('Erreur récupération ID salle:', roomError);
        return;
    }

    const roomId = roomData.id;

    const { data, error } = await supabase
        .from('examination')
        .select('id')
        .eq('student', studentId)
        .eq('examination_room', roomId)
        .single();

    if (error && error.code !== 'PGRST116') { // ignore "no rows" error
        console.error('Erreur récupération présence étudiant:', error);
        return;
    }

    if (data) {
        const { error: deleteError } = await supabase
            .from('examination')
            .delete()
            .eq('id', data.id);

        if (deleteError) {
            console.error('Erreur suppression présence étudiant:', deleteError);
        }
    } else {
        const { error: insertError } = await supabase
            .from('examination')
            .insert([{ student: studentId, examination_room: roomId }]);

        if (insertError) {
            console.error('Erreur insertion présence étudiant:', insertError);
        }
    }
}

/**
 * Récupère la liste des étudiants présents dans une salle d'examen.
 *
 * @param {string} roomCode - Le code de la salle d'examen.
 * @returns {Promise<Array>} Un tableau contenant les ID des étudiants présents.
 */
export async function fetchPresencesByRoom(roomCode) {
    const { data: roomData, error: roomError } = await supabase
        .from('examination_room')
        .select('id')
        .eq('room', roomCode)
        .single();

    if (roomError || !roomData) {
        console.error('Erreur récupération ID salle:', roomError);
        return [];
    }

    const roomId = roomData.id;

    const { data, error } = await supabase
        .from('examination')
        .select('student')
        .eq('examination_room', roomId);

    if (error) {
        console.error('Erreur récupération des présences:', error);
        return [];
    }

    return data.map(result => result.student);
}