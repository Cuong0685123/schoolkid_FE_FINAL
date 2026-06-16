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
    const [videoFile, setVideoFile] = useState<File | null>(null);
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

        if (!videoFile) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing video',
                detail: 'Please choose video file',
                life: 3000
            });
            return;
        }

        if (!thumbnailFile) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing thumbnail',
                detail: 'Please choose thumbnail image',
                life: 3000
            });
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('videoFile', videoFile);
            formData.append('thumbnailFile', thumbnailFile);

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
                        Upload school promotional video and thumbnail.
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
                </div>

                <div>
                    <label htmlFor="videoFile" className="block mb-2 font-bold">
                        Video File
                    </label>
                    <input
                        id="videoFile"
                        type="file"
                        accept="video/*"
                        disabled={saving}
                        onChange={(event) =>
                            setVideoFile(event.target.files?.[0] || null)
                        }
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        label="Create"
                        icon="pi pi-upload"
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