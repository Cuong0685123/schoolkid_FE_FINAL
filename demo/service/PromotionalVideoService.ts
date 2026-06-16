const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export type PromotionalVideo = {
    id: number;
    title: string;
    video_url: string;
    thumbnail_image_url: string;
};

export const normalizeDriveUrl = (url?: string) => {
    if (!url) return '';

    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch) {
        return `https://drive.usercontent.google.com/download?id=${idMatch[1]}`;
    }

    const fileMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) {
        return `https://drive.usercontent.google.com/download?id=${fileMatch[1]}`;
    }

    return url;
};

export const getPromotionalVideos = async (): Promise<PromotionalVideo[]> => {
    const response = await fetch(`${API_URL}/api/promotional-videos`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch promotional videos');
    }

    return response.json();
};

export const getPromotionalVideoById = async (
    id: number | string
): Promise<PromotionalVideo> => {
    const response = await fetch(`${API_URL}/api/promotional-videos/${id}`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch promotional video');
    }

    return response.json();
};

export const createPromotionalVideo = async (payload: FormData) => {
    const response = await fetch(`${API_URL}/api/promotional-videos`, {
        method: 'POST',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to create promotional video');
    }

    return response.json();
};

export const updatePromotionalVideo = async (
    id: number | string,
    payload: FormData
) => {
    const response = await fetch(`${API_URL}/api/promotional-videos/${id}`, {
        method: 'PUT',
        body: payload
    });

    if (!response.ok) {
        throw new Error('Failed to update promotional video');
    }

    return response.json();
};

export const deletePromotionalVideo = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/promotional-videos/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete promotional video');
    }

    return response.json();
};