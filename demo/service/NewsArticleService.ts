const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export type Comment = {
    id: number;
    article_id: number;
    author_name?: string;
    content?: string;
    created_at?: string;
};

export type NewsArticle = {
    id: number;
    title?: string;
    slug?: string;
    thumbnail_url?: string;
    content?: string;
    author_name?: string;
    published_at?: string;
    Comments?: Comment[];
};

export type NewsArticlePayload = {
    title?: string;
    slug?: string;
    thumbnail_url?: string;
    content?: string;
    author_name?: string;
    published_at?: string;
};

export const getNewsArticles = async (): Promise<NewsArticle[]> => {
    const response = await fetch(`${API_URL}/api/news-articles`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch news articles');
    }

    return response.json();
};

export const getNewsArticleById = async (
    id: number | string
): Promise<NewsArticle> => {
    const response = await fetch(`${API_URL}/api/news-articles/${id}`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch news article');
    }

    return response.json();
};

export const createNewsArticle = async (payload: NewsArticlePayload) => {
    const response = await fetch(`${API_URL}/api/news-articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to create news article');
    }

    return response.json();
};

export const updateNewsArticle = async (
    id: number | string,
    payload: NewsArticlePayload
) => {
    const response = await fetch(`${API_URL}/api/news-articles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update news article');
    }

    return response.json();
};

export const deleteNewsArticle = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/news-articles/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete news article');
    }

    return response.json();
};