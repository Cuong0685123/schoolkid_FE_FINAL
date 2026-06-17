'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import {
    createNewsletterSubscriber,
    deleteNewsletterSubscriber,
    getNewsletterSubscribers,
    updateNewsletterSubscriber,
    type NewsletterSubscriber
} from '../../../demo/service/NewsletterService';

const formatDate = (value?: string) => {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
};

export default function NewsletterPage() {
    const toast = useRef<Toast>(null);

    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingSubscriber, setEditingSubscriber] = useState<NewsletterSubscriber | null>(null);
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);

    const loadSubscribers = async () => {
        try {
            setLoading(true);
            const data = await getNewsletterSubscribers();
            setSubscribers(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to load newsletter subscribers',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscribers();
    }, []);

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setFilters({
            global: { value, matchMode: FilterMatchMode.CONTAINS }
        });

        setGlobalFilterValue(value);
    };

    const openCreateDialog = () => {
        setEditingSubscriber(null);
        setEmail('');
        setDialogVisible(true);
    };

    const openEditDialog = (subscriber: NewsletterSubscriber) => {
        setEditingSubscriber(subscriber);
        setEmail(subscriber.email || '');
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
        setEditingSubscriber(null);
        setEmail('');
    };

    const handleSave = async () => {
        if (!email.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing email',
                detail: 'Please enter subscriber email',
                life: 3000
            });
            return;
        }

        try {
            setSaving(true);

            if (editingSubscriber) {
                await updateNewsletterSubscriber(editingSubscriber.id, {
                    email: email.trim()
                });

                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Subscriber updated',
                    life: 3000
                });
            } else {
                await createNewsletterSubscriber({
                    email: email.trim()
                });

                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Subscriber created',
                    life: 3000
                });
            }

            closeDialog();
            loadSubscribers();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Unable to save subscriber',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Bạn có chắc muốn xóa email này không?');

        if (!confirmDelete) return;

        try {
            await deleteNewsletterSubscriber(id);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Subscriber deleted',
                life: 3000
            });

            loadSubscribers();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Unable to delete subscriber',
                life: 3000
            });
        }
    };

    const subscribedAtTemplate = (rowData: NewsletterSubscriber) => {
        return formatDate(rowData.subscribed_at);
    };

    const actionTemplate = (rowData: NewsletterSubscriber) => {
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
                <h5 className="m-0">Newsletter Subscribers</h5>
                <span className="text-color-secondary">Manage newsletter subscription emails</span>
            </div>

            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Search email"
                    />
                </span>

                <Button
                    label="Add Email"
                    icon="pi pi-plus"
                    onClick={openCreateDialog}
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
                        value={subscribers}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        loading={loading}
                        filters={filters}
                        globalFilterFields={['email']}
                        header={header}
                        emptyMessage="No subscribers found."
                        scrollable
                        scrollHeight="500px"
                        stripedRows
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }} />
                        <Column field="email" header="Email" sortable style={{ minWidth: '20rem' }} />
                        <Column header="Subscribed At" body={subscribedAtTemplate} sortable style={{ minWidth: '14rem' }} />
                        <Column header="Actions" body={actionTemplate} frozen alignFrozen="right" style={{ minWidth: '14rem' }} />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={editingSubscriber ? 'Edit Subscriber' : 'Add Subscriber'}
                visible={dialogVisible}
                draggable={false}
                onHide={closeDialog}
                style={{ width: 'min(92vw, 32rem)' }}
            >
                <div className="flex flex-column gap-4">
                    <div>
                        <label htmlFor="email" className="block mb-2 font-bold">
                            Email
                        </label>

                        <InputText
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full"
                            disabled={saving}
                            placeholder="parent@example.com"
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