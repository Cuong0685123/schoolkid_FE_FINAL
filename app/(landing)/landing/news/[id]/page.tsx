'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { getNewsArticleById } from '../../../../../demo/service/NewsArticleService';

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArticle = async () => {
            try {
                const data = await getNewsArticleById(id);
                setArticle(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadArticle();
        }
    }, [id]);

    if (loading) {
        return <h1 style={{ padding: 40 }}>Loading...</h1>;
    }

    if (!article) {
        return <h1 style={{ padding: 40 }}>Article not found</h1>;
    }

    return (
        <div style={{ background: '#fffafc', minHeight: '100vh' }}>
            <section
                style={{
                    padding: '80px 24px',
                    background: 'linear-gradient(135deg,#fff0f7,#fff8d6,#e9fff8)'
                }}
            >
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <Button
                        label="Quay lại"
                        icon="pi pi-arrow-left"
                        outlined
                        rounded
                        onClick={() => router.push('/landing')}
                    />

                    <h1
                        style={{
                            marginTop: 24,
                            fontSize: 'clamp(2rem,5vw,4rem)',
                            fontWeight: 900
                        }}
                    >
                        {article.title}
                    </h1>

                    <p style={{ color: '#666' }}>
                        {article.author_name || 'Admin'}
                    </p>
                </div>
            </section>

            <section style={{ padding: '48px 24px' }}>
                <div
                    style={{
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}
                >
                    {article.thumbnail_url && (
                        <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            style={{
                                width: '100%',
                                maxHeight: 500,
                                objectFit: 'cover',
                                borderRadius: 24,
                                marginBottom: 32
                            }}
                        />
                    )}

                    <div
                        style={{
                            fontSize: '1.1rem',
                            lineHeight: 1.9,
                            color: '#444'
                        }}
                    >
                        {article.content}
                    </div>
                </div>
            </section>
        </div>
    );
}