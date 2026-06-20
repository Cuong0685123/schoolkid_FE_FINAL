const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export type PromotionalVideo = {
    id: number;
    title: string;
    video_url: string;
    thumbnail_image_url: string;
};

export const getGoogleDriveFileId = (url?: string) => {
    if (!url) return null;

    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch) {
        return idMatch[1];
    }

    const fileMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) {
        return fileMatch[1];
    }

    return null;
};

export const normalizeDriveVideoUrl = (url?: string) => {
    const fileId = getGoogleDriveFileId(url);

    if (!fileId) return url || '';

    return `https://drive.usercontent.google.com/download?id=${fileId}`;
};

export const normalizeDriveThumbnailUrl = (url?: string) => {
    const fileId = getGoogleDriveFileId(url);

    if (!fileId) return url || '';

    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};

export const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return '';

    const watchMatch = url.match(/v=([^&]+)/);
    if (watchMatch) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
        return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
    if (embedMatch) {
        return `https://www.youtube.com/embed/${embedMatch[1]}`;
    }

    return '';
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