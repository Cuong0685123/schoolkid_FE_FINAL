const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type ProgramType = 'edu' | 'sport' | 'teacher';

export interface ProgramPayload {
    name: string;
    description?: string;
    type: ProgramType;
}

// =====================================
// PROGRAM (PARENT)
// =====================================

export const getPrograms = async () => {
    const response = await fetch(`${API_URL}/api/programs`);

    if (!response.ok) {
        throw new Error('Failed to fetch programs');
    }

    return response.json();
};

export const getProgramById = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/programs/${id}`);

    if (!response.ok) {
        throw new Error('Failed to fetch program');
    }

    return response.json();
};

export const createProgram = async (payload: ProgramPayload) => {
    const response = await fetch(`${API_URL}/api/programs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to create program');
    }

    return response.json();
};

export const updateProgram = async (
    id: number | string,
    payload: Partial<ProgramPayload>
) => {
    const response = await fetch(`${API_URL}/api/programs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update program');
    }

    return response.json();
};

export const deleteProgram = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/programs/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete program');
    }

    return response.json();
};

// =====================================
// EDUCATION
// =====================================

export const createEducationProgram = async (payload: FormData) => {
    const response = await fetch(`${API_URL}/api/programs/education`, {
        method: 'POST',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to create education program');
    }

    return response.json();
};

export const updateEducationProgram = async (
    id: number | string,
    payload: FormData
) => {
    const response = await fetch(`${API_URL}/api/programs/education/${id}`, {
        method: 'PUT',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to update education program');
    }

    return response.json();
};

export const deleteEducationProgram = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/programs/education/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete education program');
    }

    return response.json();
};

// =====================================
// SPORT
// =====================================

export const createSportProgram = async (payload: FormData) => {
    const response = await fetch(`${API_URL}/api/programs/sport`, {
        method: 'POST',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to create sport program');
    }

    return response.json();
};

export const updateSportProgram = async (
    id: number | string,
    payload: FormData
) => {
    const response = await fetch(`${API_URL}/api/programs/sport/${id}`, {
        method: 'PUT',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to update sport program');
    }

    return response.json();
};

export const deleteSportProgram = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/programs/sport/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete sport program');
    }

    return response.json();
};

// =====================================
// TEACHER
// =====================================

export const createTeacherProgram = async (payload: FormData) => {
    const response = await fetch(`${API_URL}/api/programs/teacher`, {
        method: 'POST',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to create teacher program');
    }

    return response.json();
};

export const updateTeacherProgram = async (
    id: number | string,
    payload: FormData
) => {
    const response = await fetch(`${API_URL}/api/programs/teacher/${id}`, {
        method: 'PUT',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to update teacher program');
    }

    return response.json();
};

export const deleteTeacherProgram = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/programs/teacher/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete teacher program');
    }

    return response.json();
};