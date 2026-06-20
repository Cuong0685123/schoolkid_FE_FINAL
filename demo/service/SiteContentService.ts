const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export type SiteContent = {
    id: number;
    phone_number?: string;
    support_email?: string;
    address?: string;
    admission_period?: string;
    stat_years_experience?: string;
    stat_students_info?: string;
    stat_awards_info?: string;
    footer_description?: string;
    about_section_quote?: string;
    hero_image_url?: string;
about_image_url?: string;
};

export type SiteContentPayload = {
    id?: number;
    phone_number?: string;
    support_email?: string;
    address?: string;
    admission_period?: string;
    stat_years_experience?: string;
    stat_students_info?: string;
    stat_awards_info?: string;
    footer_description?: string;
    about_section_quote?: string;
    hero_image_url?: string;
about_image_url?: string;
};

export const getSiteContents = async (): Promise<SiteContent[]> => {
    const response = await fetch(`${API_URL}/api/site-content`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch site content');
    }

    return response.json();
};

export const getSiteContentById = async (
    id: number | string
): Promise<SiteContent> => {
    const response = await fetch(`${API_URL}/api/site-content/${id}`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch site content');
    }

    return response.json();
};

export const createSiteContent = async (payload: SiteContentPayload) => {
    const response = await fetch(`${API_URL}/api/site-content`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to create site content');
    }

    return response.json();
};

export const updateSiteContent = async (
    id: number | string,
    payload: SiteContentPayload
) => {
    const response = await fetch(`${API_URL}/api/site-content/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update site content');
    }

    return response.json();
};

export const deleteSiteContent = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/site-content/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete site content');
    }

    return response.json();
};