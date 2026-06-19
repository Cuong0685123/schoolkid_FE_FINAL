'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { getProgramById } from '../../../../../demo/service/ProgramService';

export default function ProgramDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [program, setProgram] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProgram = async () => {
            try {
                const data = await getProgramById(id);
                setProgram(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadProgram();
        }
    }, [id]);

    if (loading) {
        return <h1 style={{ padding: 40 }}>Loading...</h1>;
    }

    if (!program) {
        return <h1 style={{ padding: 40 }}>Program not found</h1>;
    }

    const programItems = [
        ...(program.ProgramEdus || []),
        ...(program.ProgramSports || []),
        ...(program.ProgramTeachers || [])
    ];

    return (
        <div style={{ background: '#fffafc', minHeight: '100vh' }}>
            <section
                style={{
                    padding: '80px 24px',
                    background: 'linear-gradient(135deg,#fff0f7,#fff8d6,#e9fff8)'
                }}
            >
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            borderRadius: '999px',
                            background: '#ffffff',
                            color: '#ff5fa2',
                            fontWeight: 700,
                            marginBottom: 16
                        }}
                    >
                        Chương trình học
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                            margin: 0,
                            fontWeight: 900,
                            lineHeight: 1.05
                        }}
                    >
                        {program.name}
                    </h1>

                    <p
                        style={{
                            fontSize: '1.25rem',
                            color: '#555',
                            maxWidth: 720,
                            lineHeight: 1.8
                        }}
                    >
                        {program.description || 'Thông tin chương trình học tại Mầm Non Nắng Hồng.'}
                    </p>

                    <div className="flex gap-3 flex-wrap mt-4">
                        <Button
                            label="Quay lại trang chủ"
                            icon="pi pi-arrow-left"
                            rounded
                            outlined
                            onClick={() => router.push('/landing')}
                        />

                        <Button
                            label="Đăng ký tư vấn"
                            icon="pi pi-send"
                            rounded
                            style={{
                                background: '#ff5fa2',
                                borderColor: '#ff5fa2'
                            }}
                            onClick={() => router.push('/landing#apply')}
                        />
                    </div>
                </div>
            </section>

            <section style={{ padding: '48px 24px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="card text-center" style={{ borderRadius: 24 }}>
                                <i className="pi pi-book text-4xl" style={{ color: '#ff5fa2' }} />
                                <h3>Loại chương trình</h3>
                                <p>{program.type || '-'}</p>
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="card text-center" style={{ borderRadius: 24 }}>
                                <i className="pi pi-users text-4xl" style={{ color: '#19c79f' }} />
                                <h3>Số lớp</h3>
                                <p>{programItems.length}</p>
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="card text-center" style={{ borderRadius: 24 }}>
                                <i className="pi pi-heart text-4xl" style={{ color: '#ffc83d' }} />
                                <h3>Phù hợp</h3>
                                <p>Trẻ mầm non</p>
                            </div>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '2.5rem', marginTop: 48 }}>
                        Các lớp trong chương trình
                    </h2>

                    <div className="grid">
                        {programItems.map((item: any) => (
                            <div key={item.id} className="col-12 md:col-6 lg:col-4">
                                <div
                                    className="card h-full"
                                    style={{
                                        borderRadius: 28,
                                        border: '3px solid #ffe0ef'
                                    }}
                                >
                                    {item.thumbnail_url ? (
                                        <img
                                            src={item.thumbnail_url}
                                            alt={item.title || item.full_name}
                                            style={{
                                                width: '100%',
                                                height: 180,
                                                objectFit: 'cover',
                                                borderRadius: 20,
                                                marginBottom: 16
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: 90,
                                                height: 90,
                                                borderRadius: '50%',
                                                background: '#fff8d6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#ffc83d',
                                                marginBottom: 16
                                            }}
                                        >
                                            <i className="pi pi-sun text-4xl" />
                                        </div>
                                    )}

                                    <h3>{item.title || item.full_name || 'Lớp học'}</h3>

                                    <p style={{ color: '#666', lineHeight: 1.7 }}>
                                        {item.detail || item.bio || 'Thông tin lớp học sẽ được cập nhật.'}
                                    </p>

                                    {item.age_group ? <p><b>Độ tuổi:</b> {item.age_group}</p> : null}
                                    {item.duration_days ? <p><b>Số ngày:</b> {item.duration_days}</p> : null}
                                    {item.duration_hours ? <p><b>Số giờ:</b> {item.duration_hours}</p> : null}
                                    {item.role ? <p><b>Vai trò:</b> {item.role}</p> : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}