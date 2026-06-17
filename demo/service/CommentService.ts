const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export type NewsArticleInComment = {
    id: number;
    title?: string;
    slug?: string;
};

export type CommentRow = {
    id: number;
    article_id: number;
    author_name?: string;
    content?: string;
    created_at?: string;
    NewsArticle?: NewsArticleInComment;
};

export type CommentPayload = {
    article_id?: number;
    author_name?: string;
    content?: string;
    created_at?: string;
};

export const getComments = async (): Promise<CommentRow[]> => {
    const response = await fetch(`${API_URL}/api/comments`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch comments');
    }

    return response.json();
};

export const getCommentById = async (
    id: number | string
): Promise<CommentRow> => {
    const response = await fetch(`${API_URL}/api/comments/${id}`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch comment');
    }

    return response.json();
};

export const createComment = async (payload: CommentPayload) => {
    const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to create comment');
    }

    return response.json();
};

export const updateComment = async (
    id: number | string,
    payload: CommentPayload
) => {
    const response = await fetch(`${API_URL}/api/comments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update comment');
    }

    return response.json();
};

export const deleteComment = async (id: number | string) => {
    const response = await fetch(`${API_URL}/api/comments/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete comment');
    }

    return response.json();
};