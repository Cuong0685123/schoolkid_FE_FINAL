'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToggleButton } from 'primereact/togglebutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { getPrograms, createProgram } from '../../../demo/service/ProgramService';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
type ProgramRow = {
    id: string | number;
    name?: string;
    description?: string;
    type?: string;
    ProgramEdus?: any[];
    ProgramSports?: any[];
    ProgramTeachers?: any[];
};

const Program = () => {
    const toast = useRef<Toast>(null);
    const [idFrozen, setIdFrozen] = useState(false);
    const [programs, setPrograms] = useState<ProgramRow[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
const [parentDialogVisible, setParentDialogVisible] = useState(false);
const [parentSaving, setParentSaving] = useState(false);

const [parentForm, setParentForm] = useState({
    name: '',
    description: '',
    type: ''
});

const parentTypeOptions = [
    { label: 'Education', value: 'edu' },
    { label: 'Sport', value: 'sport' },
    { label: 'Teacher', value: 'teacher' }
];
    const loadPrograms = async () => {
        try {
            setLoading(true);
            const data = await getPrograms();
            setPrograms(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to load programs',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrograms();
    }, []);
const handleCreateParentProgram = async () => {
    if (!parentForm.name.trim()) {
        toast.current?.show({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please enter program name',
            life: 3000
        });
        return;
    }

    if (!parentForm.type) {
        toast.current?.show({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select program type',
            life: 3000
        });
        return;
    }

    try {
        setParentSaving(true);

        await createProgram({
            name: parentForm.name.trim(),
            description: parentForm.description.trim(),
            type: parentForm.type as 'edu' | 'sport' | 'teacher'
        });

        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Create parent program successfully',
            life: 3000
        });

        setParentDialogVisible(false);
        setParentForm({
            name: '',
            description: '',
            type: ''
        });

        await loadPrograms();
    } catch (error) {
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error instanceof Error ? error.message : 'Failed to create parent program',
            life: 3000
        });
    } finally {
        setParentSaving(false);
    }
};
    const typeBodyTemplate = (rowData: ProgramRow) => {
        if (rowData.type === 'edu') return 'Education';
        if (rowData.type === 'sport') return 'Sport';
        if (rowData.type === 'teacher') return 'Teacher';
        return rowData.type || '-';
    };

    const editBodyTemplate = (rowData: ProgramRow) => (
        <div className="flex gap-2">
            <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                outlined
                onClick={() => router.push(`/program/${rowData.id}`)}
            />

            <Button
                label="Detail"
                icon="pi pi-eye"
                size="small"
                severity="info"
                outlined
                onClick={() => router.push(`/program/${rowData.id}`)}
            />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />

            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="m-0">Programs</h5>
                            <p className="text-500 mt-2 mb-0">
                                Manage education, sport and teacher programs.
                            </p>
                        </div>

                        <div className="flex gap-2">
    <Button
        label="Create Parent Program"
        icon="pi pi-plus"
        severity="success"
        onClick={() => setParentDialogVisible(true)}
    />

    <Button
        label="Create Child Program"
        icon="pi pi-sitemap"
        onClick={() => router.push('/program/create')}
    />
</div>
                    </div>

                    <div className="mb-3">
                        <ToggleButton
                            checked={idFrozen}
                            onChange={(e) => setIdFrozen(e.value)}
                            onIcon="pi pi-lock"
                            offIcon="pi pi-lock-open"
                            onLabel="Unfreeze Id"
                            offLabel="Freeze Id"
                            style={{ width: '10rem' }}
                        />
                    </div>

                    <DataTable
                        value={programs}
                        scrollable
                        scrollHeight="500px"
                        loading={loading}
                        className="mt-3"
                        emptyMessage="No programs found."
                    >
                        <Column
                            field="name"
                            header="Name"
                            style={{ flexGrow: 1, flexBasis: '180px' }}
                            frozen
                            className="font-bold"
                        />

                        <Column
                            field="id"
                            header="Id"
                            style={{ flexGrow: 1, flexBasis: '80px' }}
                            frozen={idFrozen}
                            alignFrozen="left"
                            bodyClassName={classNames({ 'font-bold': idFrozen })}
                        />

                        <Column
                            field="description"
                            header="Description"
                            style={{ flexGrow: 1, flexBasis: '250px' }}
                        />

                        <Column
                            field="type"
                            header="Type"
                            body={typeBodyTemplate}
                            style={{ flexGrow: 1, flexBasis: '120px' }}
                        />

                        <Column
                            header="Education"
                            body={(rowData: ProgramRow) => rowData.ProgramEdus?.length || 0}
                            style={{ flexGrow: 1, flexBasis: '120px' }}
                        />

                        <Column
                            header="Sport"
                            body={(rowData: ProgramRow) => rowData.ProgramSports?.length || 0}
                            style={{ flexGrow: 1, flexBasis: '120px' }}
                        />

                        <Column
                            header="Teacher"
                            body={(rowData: ProgramRow) => rowData.ProgramTeachers?.length || 0}
                            style={{ flexGrow: 1, flexBasis: '120px' }}
                        />

                        <Column
                            header="Actions"
                            body={editBodyTemplate}
                            style={{ flexGrow: 0, flexBasis: '220px' }}
                        />
                    </DataTable>
                </div>
            </div>


            <Dialog
    header="Create Parent Program"
    visible={parentDialogVisible}
    style={{ width: '450px' }}
    modal
    onHide={() => setParentDialogVisible(false)}
    footer={
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancel"
                severity="secondary"
                outlined
                onClick={() => setParentDialogVisible(false)}
            />

            <Button
                label="Create"
                loading={parentSaving}
                onClick={handleCreateParentProgram}
            />
        </div>
    }
>
    <div className="flex flex-column gap-3">

        <div>
            <label className="font-bold mb-2 block">
                Program Name
            </label>

            <InputText
                className="w-full"
                value={parentForm.name}
                onChange={(e) =>
                    setParentForm({
                        ...parentForm,
                        name: e.target.value
                    })
                }
            />
        </div>

        <div>
            <label className="font-bold mb-2 block">
                Description
            </label>

            <InputText
                className="w-full"
                value={parentForm.description}
                onChange={(e) =>
                    setParentForm({
                        ...parentForm,
                        description: e.target.value
                    })
                }
            />
        </div>

        <div>
            <label className="font-bold mb-2 block">
                Type
            </label>

            <Dropdown
                className="w-full"
                value={parentForm.type}
                options={parentTypeOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Select Program Type"
                onChange={(e) =>
                    setParentForm({
                        ...parentForm,
                        type: e.value
                    })
                }
            />
        </div>

    </div>
</Dialog>
        </>
    );
};

export default Program;