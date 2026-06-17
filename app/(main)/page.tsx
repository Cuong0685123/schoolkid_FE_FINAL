'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation';
import { getPrograms } from '../../demo/service/ProgramService';
import {
    getPromotionalVideos,
    PromotionalVideo,
    normalizeDriveThumbnailUrl,
    normalizeDriveVideoUrl
} from '../../demo/service/PromotionalVideoService';

type ProgramRow = {
    id: number | string;
    name?: string;
    description?: string;
    type?: string;
    ProgramEdus?: any[];
    ProgramSports?: any[];
    ProgramTeachers?: any[];
};

export default function SchoolKidDashboard() {
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const [programs, setPrograms] = useState<ProgramRow[]>([]);
    const [videos, setVideos] = useState<PromotionalVideo[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const [programData, videoData] = await Promise.all([
                getPrograms(),
                getPromotionalVideos()
            ]);

            setPrograms(Array.isArray(programData) ? programData : []);
            setVideos(Array.isArray(videoData) ? videoData : []);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Dashboard Error',
                detail: error instanceof Error ? error.message : 'Failed to load dashboard',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const latestPrograms = programs.slice(0, 5);
    const latestVideos = videos.slice(0, 5);

    const totalEducation = programs.reduce((total, item) => {
        return total + (item.ProgramEdus?.length || 0);
    }, 0);

    const totalSport = programs.reduce((total, item) => {
        return total + (item.ProgramSports?.length || 0);
    }, 0);

    const totalTeacher = programs.reduce((total, item) => {
        return total + (item.ProgramTeachers?.length || 0);
    }, 0);

    const videoThumbnailTemplate = (rowData: PromotionalVideo) => {
    const thumbnailUrl = normalizeDriveThumbnailUrl(
        rowData.thumbnail_image_url
    );

    return (
        <img
            src={thumbnailUrl}
            alt={rowData.title}
            style={{
                width: '90px',
                height: '55px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd'
            }}
        />
    );
};

    const videoActionTemplate = (rowData: PromotionalVideo) => {
    const videoUrl = normalizeDriveVideoUrl(rowData.video_url);

        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-external-link"
                    label="Open"
                    size="small"
                    text
                    onClick={() => window.open(videoUrl, '_blank')}
                />
                <Button
                    icon="pi pi-pencil"
                    label="Edit"
                    size="small"
                    text
                    onClick={() => router.push(`/promotional-video/${rowData.id}`)}
                />
            </div>
        );
    };

    const programTypeTemplate = (rowData: ProgramRow) => {
        if (rowData.type === 'edu') return 'Education';
        if (rowData.type === 'sport') return 'Sport';
        if (rowData.type === 'teacher') return 'Teacher';
        return rowData.type || '-';
    };

    return (
        <>
            <Toast ref={toast} />

            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <h2 className="m-0">SchoolKid Dashboard</h2>
                                <p className="text-500 mt-2 mb-0">
                                    Overview of programs, videos and school content.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    label="Programs"
                                    icon="pi pi-book"
                                    outlined
                                    onClick={() => router.push('/program')}
                                />
                                <Button
                                    label="Videos"
                                    icon="pi pi-video"
                                    onClick={() => router.push('/promotional-video')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-6 lg:col-3">
                    <div className="card">
                        <div className="flex justify-content-between">
                            <div>
                                <span className="block text-500 font-medium mb-3">
                                    Parent Programs
                                </span>
                                <div className="text-900 font-medium text-xl">
                                    {programs.length}
                                </div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-book text-blue-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-6 lg:col-3">
                    <div className="card">
                        <div className="flex justify-content-between">
                            <div>
                                <span className="block text-500 font-medium mb-3">
                                    Education Classes
                                </span>
                                <div className="text-900 font-medium text-xl">
                                    {totalEducation}
                                </div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-green-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-pencil text-green-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-6 lg:col-3">
                    <div className="card">
                        <div className="flex justify-content-between">
                            <div>
                                <span className="block text-500 font-medium mb-3">
                                    Sport Classes
                                </span>
                                <div className="text-900 font-medium text-xl">
                                    {totalSport}
                                </div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-star text-orange-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-6 lg:col-3">
                    <div className="card">
                        <div className="flex justify-content-between">
                            <div>
                                <span className="block text-500 font-medium mb-3">
                                    Promotional Videos
                                </span>
                                <div className="text-900 font-medium text-xl">
                                    {videos.length}
                                </div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-purple-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-video text-purple-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-6">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-3">
                            <h5 className="m-0">Latest Programs</h5>
                            <Button
                                label="View All"
                                icon="pi pi-arrow-right"
                                text
                                onClick={() => router.push('/program')}
                            />
                        </div>

                        <DataTable
                            value={latestPrograms}
                            loading={loading}
                            emptyMessage="No programs found."
                            rows={5}
                        >
                            <Column field="id" header="ID" style={{ width: '70px' }} />
                            <Column field="name" header="Name" />
                            <Column header="Type" body={programTypeTemplate} />
                        </DataTable>
                    </div>
                </div>

                <div className="col-12 lg:col-6">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-3">
                            <h5 className="m-0">Latest Promotional Videos</h5>
                            <Button
                                label="View All"
                                icon="pi pi-arrow-right"
                                text
                                onClick={() => router.push('/promotional-video')}
                            />
                        </div>

                        <DataTable
                            value={latestVideos}
                            loading={loading}
                            emptyMessage="No videos found."
                            rows={5}
                        >
                            <Column field="id" header="ID" style={{ width: '70px' }} />
                            <Column header="Thumbnail" body={videoThumbnailTemplate} />
                            <Column field="title" header="Title" />
                            <Column header="Action" body={videoActionTemplate} />
                        </DataTable>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card">
                        <h5>Next Modules</h5>
                        <div className="grid">
                            <div className="col-12 md:col-4">
                                <div className="p-3 border-1 surface-border border-round">
                                    <h6 className="m-0 mb-2">Applications</h6>
                                    <p className="text-500 m-0">
                                        Student application management will be connected next.
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 md:col-4">
                                <div className="p-3 border-1 surface-border border-round">
                                    <h6 className="m-0 mb-2">News Articles</h6>
                                    <p className="text-500 m-0">
                                        News content management will be connected next.
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 md:col-4">
                                <div className="p-3 border-1 surface-border border-round">
                                    <h6 className="m-0 mb-2">Site Content</h6>
                                    <p className="text-500 m-0">
                                        Contact information and landing content will be connected next.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}