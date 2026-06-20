'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { createNewsArticle } from '../../../../demo/service/NewsArticleService';

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

export default function CreateNewsArticlePage() {
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [publishedAt, setPublishedAt] = useState<Date | null>(new Date());
    const [saving, setSaving] = useState(false);

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

            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('slug', slug.trim() || generateSlug(title));
            formData.append('content', content.trim());
            formData.append('author_name', authorName.trim() || 'Admin SchoolKid');
            formData.append(
                'published_at',
                publishedAt ? publishedAt.toISOString() : new Date().toISOString()
            );

            if (thumbnailFile) {
                formData.append('thumbnailFile', thumbnailFile);
            }

            await createNewsArticle(formData as any);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Article created successfully',
                life: 2000
            });

            router.push('/news-articles');
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to create article',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="m-0">Create News Article</h2>
                    <p className="text-500 mt-2 mb-0">
                        Create a new article for SchoolKid news section.
                    </p>
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
                        placeholder="Khai giảng khóa học hè 2025"
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
                        placeholder="khai-giang-khoa-hoc-he-2025"
                    />
                </div>

                <div>
                    <label htmlFor="thumbnailFile" className="block mb-2 font-bold">
                        Thumbnail Image
                    </label>
                    <input
                        id="thumbnailFile"
                        type="file"
                        accept="image/*"
                        disabled={saving}
                        onChange={(event) =>
                            setThumbnailFile(event.target.files?.[0] || null)
                        }
                    />

                    {thumbnailFile ? (
                        <p className="text-500 mt-2 mb-0">
                            Selected: {thumbnailFile.name}
                        </p>
                    ) : null}
                </div>

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
                        placeholder="Admin SchoolKid"
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
                        placeholder="Nội dung bài viết..."
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        label="Create"
                        icon="pi pi-check"
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