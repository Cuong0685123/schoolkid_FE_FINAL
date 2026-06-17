'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import {
    deletePromotionalVideo,
    getPromotionalVideos,
    normalizeDriveThumbnailUrl,
    normalizeDriveVideoUrl,
    PromotionalVideo
} from '../../../demo/service/PromotionalVideoService';

const PromotionalVideoPage = () => {
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const [videos, setVideos] = useState<PromotionalVideo[]>([]);
    const [loading, setLoading] = useState(true);

    const loadVideos = async () => {
        try {
            setLoading(true);
            const data = await getPromotionalVideos();
            setVideos(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to load videos',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVideos();
    }, []);

    const thumbnailTemplate = (rowData: PromotionalVideo) => {
        const thumbnailUrl = normalizeDriveThumbnailUrl(rowData.thumbnail_image_url);

        return (
            <img
                src={thumbnailUrl}
                alt={rowData.title}
                style={{
                    width: '120px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                }}
            />
        );
    };

    const videoTemplate = (rowData: PromotionalVideo) => {
        const videoUrl = normalizeDriveVideoUrl(rowData.video_url);

        return (
            <div className="flex flex-column gap-2">
                <video
                    src={videoUrl}
                    controls
                    preload="metadata"
                    style={{
                        width: '180px',
                        height: '100px',
                        borderRadius: '8px',
                        backgroundColor: '#000'
                    }}
                />

                <Button
                    label="Open"
                    icon="pi pi-external-link"
                    size="small"
                    text
                    onClick={() => window.open(videoUrl, '_blank')}
                />
            </div>
        );
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Bạn có chắc muốn xóa video này không?');

        if (!confirmDelete) return;

        try {
            await deletePromotionalVideo(id);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Xóa video thành công',
                life: 3000
            });

            loadVideos();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to delete video',
                life: 3000
            });
        }
    };

    const actionTemplate = (rowData: PromotionalVideo) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    label="Edit"
                    size="small"
                    outlined
                    onClick={() => router.push(`/promotional-video/${rowData.id}`)}
                />

                <Button
                    icon="pi pi-trash"
                    label="Delete"
                    size="small"
                    severity="danger"
                    outlined
                    onClick={() => handleDelete(rowData.id)}
                />
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />

            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="m-0">Promotional Videos</h5>
                            <p className="text-500 mt-2 mb-0">
                                Manage school promotional videos.
                            </p>
                        </div>

                        <Button
                            label="Create Video"
                            icon="pi pi-plus"
                            onClick={() => router.push('/promotional-video/create')}
                        />
                    </div>

                    <DataTable
                        value={videos}
                        loading={loading}
                        paginator
                        rows={5}
                        emptyMessage="No promotional videos found."
                    >
                        <Column field="id" header="ID" style={{ width: '80px' }} />
                        <Column field="title" header="Title" />
                        <Column header="Thumbnail" body={thumbnailTemplate} />
                        <Column header="Video Preview" body={videoTemplate} />
                        <Column header="Actions" body={actionTemplate} style={{ width: '220px' }} />
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default PromotionalVideoPage;