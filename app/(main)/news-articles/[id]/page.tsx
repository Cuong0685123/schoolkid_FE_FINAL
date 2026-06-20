'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import {
    getNewsArticleById,
    updateNewsArticle,
    type NewsArticle
} from '../../../../demo/service/NewsArticleService';

const generateSlug = (value: string) => {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const getGoogleDriveFileId = (url?: string) => {
    if (!url) return null;

    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch) return idMatch[1];

    const fileMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) return fileMatch[1];

    return null;
};

const normalizeDriveThumbnailUrl = (url?: string) => {
    const fileId = getGoogleDriveFileId(url);

    if (!fileId) return url || '';

    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};

export default function EditNewsArticlePage() {
    const params = useParams();
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const id = params.id as string;

    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [publishedAt, setPublishedAt] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadArticle = async () => {
        try {
            setLoading(true);

            const data = await getNewsArticleById(id);

            setArticle(data);
            setTitle(data.title || '');
            setSlug(data.slug || '');
            setThumbnailUrl(data.thumbnail_url || '');
            setContent(data.content || '');
            setAuthorName(data.author_name || '');
            setPublishedAt(data.published_at ? new Date(data.published_at) : null);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to load article',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadArticle();
        }
    }, [id]);

    const handleTitleChange = (value: string) => {
        setTitle(value);

        if (!slug.trim()) {
            setSlug(generateSlug(value));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing title',
                detail: 'Please enter article title',
                life: 3000
            });
            return;
        }

        try {
            setSaving(true);

            await updateNewsArticle(id, {
                title: title.trim(),
                slug: slug.trim() || generateSlug(title),
                thumbnail_url: thumbnailUrl.trim(),
                content: content.trim(),
                author_name: authorName.trim() || 'Admin SchoolKid',
                published_at: publishedAt ? publishedAt.toISOString() : new Date().toISOString()
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Article updated successfully',
                life: 2000
            });

            await loadArticle();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to update article',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="card">
                <Toast ref={toast} />
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="card">
                <Toast ref={toast} />
                <h2>Article not found</h2>
                <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    onClick={() => router.push('/news-articles')}
                />
            </div>
        );
    }

    const previewThumbnailUrl = normalizeDriveThumbnailUrl(thumbnailUrl);

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="m-0">Edit News Article</h2>
                    <p className="text-500 mt-2 mb-0">Article ID: {article.id}</p>
                </div>

                <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    outlined
                    onClick={() => router.push('/news-articles')}
                />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                <div>
                    <label htmlFor="title" className="block mb-2 font-bold">
                        Title
                    </label>
                    <InputText
                        id="title"
                        value={title}
                        onChange={(event) => handleTitleChange(event.target.value)}
                        className="w-full"
                        disabled={saving}
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block mb-2 font-bold">
                        Slug
                    </label>
                    <InputText
                        id="slug"
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                        className="w-full"
                        disabled={saving}
                    />
                </div>

                <div>
                    <label htmlFor="thumbnailUrl" className="block mb-2 font-bold">
                        Thumbnail URL
                    </label>
                    <InputText
                        id="thumbnailUrl"
                        value={thumbnailUrl}
                        onChange={(event) => setThumbnailUrl(event.target.value)}
                        className="w-full"
                        disabled={saving}
                        placeholder="https://drive.google.com/uc?id=..."
                    />
                </div>

                {previewThumbnailUrl ? (
                    <div>
                        <h4>Current Thumbnail</h4>
                        <img
                            src={previewThumbnailUrl}
                            alt={title}
                            style={{
                                width: '300px',
                                maxHeight: '180px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>
                ) : null}

                <div>
                    <label htmlFor="authorName" className="block mb-2 font-bold">
                        Author Name
                    </label>
                    <InputText
                        id="authorName"
                        value={authorName}
                        onChange={(event) => setAuthorName(event.target.value)}
                        className="w-full"
                        disabled={saving}
                    />
                </div>

                <div>
                    <label htmlFor="publishedAt" className="block mb-2 font-bold">
                        Published At
                    </label>
                    <Calendar
                        id="publishedAt"
                        value={publishedAt}
                        onChange={(event) => setPublishedAt(event.value as Date)}
                        showTime
                        hourFormat="24"
                        className="w-full"
                        disabled={saving}
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block mb-2 font-bold">
                        Content
                    </label>
                    <InputTextarea
                        id="content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        rows={10}
                        className="w-full"
                        disabled={saving}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        label="Save"
                        icon="pi pi-save"
                        loading={saving}
                    />

                    <Button
                        type="button"
                        label="Cancel"
                        icon="pi pi-times"
                        severity="secondary"
                        outlined
                        disabled={saving}
                        onClick={() => router.push('/news-articles')}
                    />
                </div>
            </form>
        </div>
    );
}