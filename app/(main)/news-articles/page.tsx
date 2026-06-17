'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import {
    deleteNewsArticle,
    getNewsArticles,
    type NewsArticle
} from '../../../demo/service/NewsArticleService';

const formatDate = (value?: string) => {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
};

export default function NewsArticlesPage() {
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await getNewsArticles();
            setArticles(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to load news articles',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setFilters({
            global: { value, matchMode: FilterMatchMode.CONTAINS }
        });

        setGlobalFilterValue(value);
    };

    const thumbnailTemplate = (rowData: NewsArticle) => {
        if (!rowData.thumbnail_url) return '-';

        return (
            <img
                src={rowData.thumbnail_url}
                alt={rowData.title || 'thumbnail'}
                style={{
                    width: '100px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                }}
            />
        );
    };

    const contentTemplate = (rowData: NewsArticle) => {
        if (!rowData.content) return '-';

        const text = rowData.content.replace(/\s+/g, ' ').trim();
        return text.length > 80 ? `${text.slice(0, 80)}...` : text;
    };

    const commentCountTemplate = (rowData: NewsArticle) => {
        return rowData.Comments?.length || 0;
    };

    const publishedAtTemplate = (rowData: NewsArticle) => {
        return formatDate(rowData.published_at);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Bạn có chắc muốn xóa bài viết này không?');

        if (!confirmDelete) return;

        try {
            await deleteNewsArticle(id);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Xóa bài viết thành công',
                life: 3000
            });

            loadArticles();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to delete article',
                life: 3000
            });
        }
    };

    const actionTemplate = (rowData: NewsArticle) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    label="Edit"
                    size="small"
                    outlined
                    onClick={() => router.push(`/news-articles/${rowData.id}`)}
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

    const header = (
        <div className="flex flex-column gap-3 md:flex-row md:align-items-center md:justify-content-between">
            <div>
                <h5 className="m-0">News Articles</h5>
                <span className="text-color-secondary">Manage school news articles</span>
            </div>

            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Search news"
                    />
                </span>

                <Button
                    label="Create Article"
                    icon="pi pi-plus"
                    onClick={() => router.push('/news-articles/create')}
                />
            </div>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />

            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={articles}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        loading={loading}
                        filters={filters}
                        globalFilterFields={['title', 'slug', 'author_name', 'content']}
                        header={header}
                        emptyMessage="No news articles found."
                        scrollable
                        scrollHeight="500px"
                        stripedRows
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: '5rem' }} />
                        <Column header="Thumbnail" body={thumbnailTemplate} style={{ minWidth: '9rem' }} />
                        <Column field="title" header="Title" sortable style={{ minWidth: '14rem' }} />
                        <Column field="slug" header="Slug" style={{ minWidth: '12rem' }} />
                        <Column field="author_name" header="Author" sortable style={{ minWidth: '10rem' }} />
                        <Column header="Content" body={contentTemplate} style={{ minWidth: '20rem' }} />
                        <Column header="Comments" body={commentCountTemplate} style={{ minWidth: '8rem' }} />
                        <Column header="Published" body={publishedAtTemplate} sortable style={{ minWidth: '12rem' }} />
                        <Column header="Actions" body={actionTemplate} frozen alignFrozen="right" style={{ minWidth: '14rem' }} />
                    </DataTable>
                </div>
            </div>
        </>
    );
}