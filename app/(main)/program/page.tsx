'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToggleButton } from 'primereact/togglebutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { getPrograms } from '../../../demo/service/ProgramService';
import { useRouter } from 'next/navigation';

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

                        <Button
                            label="Create Program"
                            icon="pi pi-plus"
                            onClick={() => router.push('/program/create')}
                        />
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
        </>
    );
};

export default Program;