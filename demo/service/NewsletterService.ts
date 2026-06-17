const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export type NewsletterSubscriber = {
    id: number;
    email: string;
    subscribed_at?: string;
};

export type NewsletterPayload = {
    email: string;
};

export const getNewsletterSubscribers = async (): Promise<NewsletterSubscriber[]> => {
    const response = await fetch(`${API_URL}/api/newsletter`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch newsletter subscribers');
    }

    return response.json();
};

export const getNewsletterSubscriberById = async (
    id: number | string
): Promise<NewsletterSubscriber> => {
    const response = await fetch(`${API_URL}/api/newsletter/${id}`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch newsletter subscriber');
    }

    return response.json();
};

export const createNewsletterSubscriber = async (payload: NewsletterPayload) => {
    const response = await fetch(`${API_URL}/api/newsletter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to create newsletter subscriber');
    }

    return response.json();
};

export const updateNewsletterSubscriber = async (
    id: number | string,
    payload: NewsletterPayload
) => {
    const response = await fetch(`${API_URL}/api/newsletter/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update newsletter subscriber');
    }

    return response.json();
};

export const deleteNewsletterSubscriber = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/newsletter/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete newsletter subscriber');
    }

    return response.json();
};