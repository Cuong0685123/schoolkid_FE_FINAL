'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import {
    PromotionalVideo,
    getPromotionalVideoById,
    normalizeDriveThumbnailUrl,
    normalizeDriveVideoUrl,
    updatePromotionalVideo
} from '../../../../demo/service/PromotionalVideoService';

export default function VideoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const id = params.id as string;

    const [video, setVideo] = useState<PromotionalVideo | null>(null);
    const [title, setTitle] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadVideo = async () => {
        try {
            setLoading(true);

            const data = await getPromotionalVideoById(id);

            setVideo(data);
            setTitle(data.title || '');
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to load video',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadVideo();
        }
    }, [id]);

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

        try {
            setSaving(true);

            const formData = new FormData();
            formData.append('title', title.trim());

            if (videoFile) {
                formData.append('videoFile', videoFile);
            }

            if (thumbnailFile) {
                formData.append('thumbnailFile', thumbnailFile);
            }

            await updatePromotionalVideo(id, formData);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Video updated successfully',
                life: 3000
            });

            setVideoFile(null);
            setThumbnailFile(null);
            await loadVideo();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to update video',
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

    if (!video) {
        return (
            <div className="card">
                <Toast ref={toast} />
                <h2>Video not found</h2>
                <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    onClick={() => router.push('/promotional-video')}
                />
            </div>
        );
    }

   const thumbnailUrl = normalizeDriveThumbnailUrl(video.thumbnail_image_url);
const videoUrl = normalizeDriveVideoUrl(video.video_url);

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="m-0">Edit Promotional Video</h2>
                    <p className="text-500 mt-2 mb-0">Video ID: {video.id}</p>
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
                    />
                </div>

                <div>
                    <h4>Current Thumbnail</h4>

                    <div className="flex flex-column gap-2">
                        <img
                            src={thumbnailUrl}
                            alt={video.title}
                            style={{
                                width: '300px',
                                maxHeight: '180px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}
                        />

                        <a href={thumbnailUrl} target="_blank" rel="noreferrer">
                            Open Thumbnail
                        </a>
                    </div>
                </div>

                <div>
                    <label htmlFor="thumbnailFile" className="block mb-2 font-bold">
                        Replace Thumbnail
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
                    <h4>Current Video</h4>

                    <div className="flex flex-column gap-2">
                        <video
                            src={videoUrl}
                            controls
                            preload="metadata"
                            style={{
                                width: '360px',
                                maxWidth: '100%',
                                borderRadius: '8px',
                                backgroundColor: '#000'
                            }}
                        />

                        <a href={videoUrl} target="_blank" rel="noreferrer">
                            Open Video
                        </a>
                    </div>
                </div>

                <div>
                    <label htmlFor="videoFile" className="block mb-2 font-bold">
                        Replace Video
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
                        onClick={() => router.push('/promotional-video')}
                    />
                </div>
            </form>
        </div>
    );
}