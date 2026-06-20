'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { createPromotionalVideo } from '../../../../demo/service/PromotionalVideoService';

export default function CreatePromotionalVideoPage() {
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing title',
                detail: 'Please enter video title',
                life: 3000
            });
            return;
        }

        if (!videoUrl.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing Youtube URL',
                detail: 'Please enter Youtube URL',
                life: 3000
            });
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('video_url', videoUrl.trim());

            if (thumbnailFile) {
                formData.append('thumbnailFile', thumbnailFile);
            }

            await createPromotionalVideo(formData);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Video created successfully',
                life: 2000
            });

            router.push('/promotional-video');
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to create video',
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
                    <h2 className="m-0">Create Promotional Video</h2>
                    <p className="text-500 mt-2 mb-0">
                        Add a YouTube promotional video and optional thumbnail.
                    </p>
                </div>

                <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    outlined
                    onClick={() => router.push('/promotional-video')}
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
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full"
                        disabled={saving}
                        placeholder="Video giới thiệu trường"
                    />
                </div>

                <div>
                    <label htmlFor="videoUrl" className="block mb-2 font-bold">
                        Youtube URL
                    </label>
                    <InputText
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(event) => setVideoUrl(event.target.value)}
                        className="w-full"
                        disabled={saving}
                        placeholder="https://www.youtube.com/watch?v=..."
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

                    <p className="text-500 mt-2 mb-0">
                        Optional. If empty, YouTube will show its default thumbnail.
                    </p>
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
                        onClick={() => router.push('/promotional-video')}
                    />
                </div>
            </form>
        </div>
    );
}