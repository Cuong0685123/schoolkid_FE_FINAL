'use client';

import React from 'react';
import styles from '../../app/(landing)/landing/landing.module.scss';
import { landingText, type LandingLanguage } from '../../app/(landing)/landing/lang';
import LazyImage from './LazyImage';

interface FacilitiesSectionProps {
    lang: LandingLanguage;
    getImageUrl?: (url?: string, width?: number) => string;
}

export default function FacilitiesSection({ lang, getImageUrl }: FacilitiesSectionProps) {
    const t = landingText[lang];

    const facilities = [
        {
            id: 1,
            title: t.facilityMam,
            desc: t.facilityMamDesc,
            badge: 'Lớp học',
            icon: '🌱',
            imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 2,
            title: t.facilityChoi,
            desc: t.facilityChoiDesc,
            badge: 'Lớp học',
            icon: '🌿',
            imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 3,
            title: t.facilityLa,
            desc: t.facilityLaDesc,
            badge: 'Lớp học',
            icon: '🌳',
            imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 4,
            title: t.facilityPlayCorner,
            desc: t.facilityPlayCornerDesc,
            badge: 'Vui chơi',
            icon: '🧸',
            imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 5,
            title: t.facilityFreePlay,
            desc: t.facilityFreePlayDesc,
            badge: 'Vận động',
            icon: '🏃',
            imageUrl: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 6,
            title: t.facilityOffice,
            desc: t.facilityOfficeDesc,
            badge: 'Tiếp đón',
            icon: '📋',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
        }
    ];

    return (
        <section
            id="facilities"
            className={`px-4 py-8 relative ${styles.softSection} ${styles.sectionMotion}`}
        >
            <div className={styles.sectionFloatingIcons} aria-hidden="true">
                <span className={`${styles.sectionIcon} ${styles.sectionIcon1}`}>🎨</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon2}`}>🧩</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon3}`}>🌈</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon4}`}>⭐</span>
            </div>

            <div style={{ maxWidth: '1180px', margin: '0 auto' }} className={styles.sectionContentMotion}>
                <div className={`text-center mb-6 ${styles.sectionTitle} ${styles.fadeUp}`}>
                    <div
                        className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3 ${styles.badgeCandy}`}
                        style={{
                            background: '#fff',
                            color: '#00c896',
                            boxShadow: '0 8px 18px rgba(0,200,150,.18)'
                        }}
                    >
                        {t.facilitiesBadge}
                    </div>

                    <h2
                        className="m-0 mb-3"
                        style={{
                            fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.03em'
                        }}
                    >
                        {t.facilitiesTitle}
                    </h2>

                    <p className="text-600 text-lg line-height-3 m-0" style={{ maxWidth: 640, margin: '0 auto' }}>
                        {t.facilitiesDesc}
                    </p>
                </div>

                <div className="grid">
                    {facilities.map((item) => (
                        <div key={item.id} className="col-12 md:col-6 lg:col-4 p-3">
                            <div
                                className={`card h-full ${styles.cardHover} ${styles.rainbowCard}`}
                                style={{
                                    borderRadius: 28,
                                    border: '3px solid #e1fbf4',
                                    boxShadow: '0 12px 28px rgba(0,200,150,.12)',
                                    background: '#ffffff',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ position: 'relative', width: '100%', height: 210, overflow: 'hidden' }}>
                                    <LazyImage
                                        className={styles.imageHover}
                                        src={getImageUrl ? getImageUrl(item.imageUrl, 500) : item.imageUrl}
                                        alt={item.title}
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <span
                                        className="font-bold text-xs px-3 py-1 border-round-2xl"
                                        style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            background: 'rgba(255,255,255,0.92)',
                                            color: '#00c896',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {item.badge}
                                    </span>
                                </div>

                                <div className="p-4 flex-1 flex flex-column justify-content-between">
                                    <div>
                                        <div className="flex align-items-center gap-2 mb-2">
                                            <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                                            <h3 className="m-0 text-xl font-bold" style={{ color: '#2b232a' }}>
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="text-600 line-height-3 m-0 text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}