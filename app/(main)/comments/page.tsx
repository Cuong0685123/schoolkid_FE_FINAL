'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import {
    deleteComment,
    getComments,
    updateComment,
    type CommentRow
} from '../../../demo/service/CommentService';

const formatDate = (value?: string) => {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
};

export default function CommentsPage() {
    const toast = useRef<Toast>(null);

    const [comments, setComments] = useState<CommentRow[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState<CommentRow | null>(null);
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);

    const loadComments = async () => {
        try {
            setLoading(true);

            const data = await getComments();
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to load comments',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, []);

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setFilters({
            global: { value, matchMode: FilterMatchMode.CONTAINS }
        });

        setGlobalFilterValue(value);
    };

    const openEditDialog = (comment: CommentRow) => {
        setSelectedComment(comment);
        setAuthorName(comment.author_name || '');
        setContent(comment.content || '');
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
        setSelectedComment(null);
        setAuthorName('');
        setContent('');
    };

    const handleSave = async () => {
        if (!selectedComment) return;

        if (!authorName.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing author',
                detail: 'Please enter author name',
                life: 3000
            });
            return;
        }

        if (!content.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing content',
                detail: 'Please enter comment content',
                life: 3000
            });
            return;
        }

        try {
            setSaving(true);

            const response: any = await updateComment(selectedComment.id, {
                author_name: authorName.trim(),
                content: content.trim()
            });

            const updatedComment = response?.comment || response?.data || response || {};

            setComments((currentComments) =>
                currentComments.map((comment) =>
                    comment.id === selectedComment.id
                        ? {
                              ...comment,
                              ...updatedComment,
                              author_name: authorName.trim(),
                              content: content.trim()
                          }
                        : comment
                )
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Comment updated',
                life: 3000
            });

            closeDialog();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Unable to update comment',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Bạn có chắc muốn xóa comment này không?');

        if (!confirmDelete) return;

        try {
            await deleteComment(id);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Comment deleted',
                life: 3000
            });

            loadComments();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Unable to delete comment',
                life: 3000
            });
        }
    };

    const articleTemplate = (rowData: CommentRow) => {
        return rowData.NewsArticle?.title || `Article #${rowData.article_id}`;
    };

    const contentTemplate = (rowData: CommentRow) => {
        if (!rowData.content) return '-';

        const text = rowData.content.replace(/\s+/g, ' ').trim();

        return text.length > 80 ? `${text.slice(0, 80)}...` : text;
    };

    const createdAtTemplate = (rowData: CommentRow) => {
        return formatDate(rowData.created_at);
    };

    const actionTemplate = (rowData: CommentRow) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    label="Edit"
                    size="small"
                    outlined
                    onClick={() => openEditDialog(rowData)}
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
                <h5 className="m-0">Comments</h5>
                <span className="text-color-secondary">Manage comments from news articles</span>
            </div>

            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Search comments"
                />
            </span>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />

            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={comments}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        loading={loading}
                        filters={filters}
                        globalFilterFields={['author_name', 'content']}
                        header={header}
                        emptyMessage="No comments found."
                        scrollable
                        scrollHeight="500px"
                        stripedRows
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: '5rem' }} />
                        <Column field="article_id" header="Article ID" sortable style={{ minWidth: '8rem' }} />
                        <Column header="Article" body={articleTemplate} style={{ minWidth: '16rem' }} />
                        <Column field="author_name" header="Author" sortable style={{ minWidth: '12rem' }} />
                        <Column header="Content" body={contentTemplate} style={{ minWidth: '24rem' }} />
                        <Column header="Created At" body={createdAtTemplate} sortable style={{ minWidth: '14rem' }} />
                        <Column header="Actions" body={actionTemplate} frozen alignFrozen="right" style={{ minWidth: '14rem' }} />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={selectedComment ? `Edit Comment #${selectedComment.id}` : 'Edit Comment'}
                visible={dialogVisible}
                draggable={false}
                onHide={closeDialog}
                style={{ width: 'min(92vw, 42rem)' }}
            >
                <div className="flex flex-column gap-4">
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
                        <label htmlFor="content" className="block mb-2 font-bold">
                            Content
                        </label>

                        <InputTextarea
                            id="content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            rows={6}
                            className="w-full"
                            disabled={saving}
                        />
                    </div>

                    <div className="flex gap-2 justify-content-end">
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            loading={saving}
                            onClick={handleSave}
                        />

                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            severity="secondary"
                            outlined
                            disabled={saving}
                            onClick={closeDialog}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
}