'use client';

import React, { useState } from 'react';
import styles from '../../app/(landing)/landing/landing.module.scss';
import { landingText, type LandingLanguage } from '../../app/(landing)/landing/lang';
import LazyImage from './LazyImage';

interface FacilitiesSectionProps {
    lang: LandingLanguage;
    getImageUrl?: (url?: string, width?: number) => string;
}

export default function FacilitiesSection({ lang, getImageUrl }: FacilitiesSectionProps) {
    const t = landingText[lang];
    const [selectedTab, setSelectedTab] = useState<'all' | 'indoor' | 'outdoor'>('all');

    // Dữ liệu mẫu cơ sở vật chất (sử dụng ảnh placeholder minh họa nhẹ, phụ huynh nhìn thấy ngay)
    const facilities = [
        {
            id: 1,
            title: t.facilityClassroom,
            desc: t.facilityClassroomDesc,
            category: 'indoor',
            badge: 'Montessori',
            icon: '🏫',
            // Dùng ảnh demo minh họa chất lượng cao qua unsplash CDN (rất nhẹ và nhanh)
            imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 2,
            title: t.facilityPlayground,
            desc: t.facilityPlaygroundDesc,
            category: 'outdoor',
            badge: 'Outdoor',
            icon: '🎠',
            imageUrl: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 3,
            title: t.facilityArtMusic,
            desc: t.facilityArtMusicDesc,
            category: 'indoor',
            badge: 'Creativity',
            icon: '🎨',
            imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 4,
            title: t.facilityKitchen,
            desc: t.facilityKitchenDesc,
            category: 'indoor',
            badge: 'Nutrition',
            icon: '🍲',
            imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 5,
            title: t.facilityLibrary,
            desc: t.facilityLibraryDesc,
            category: 'indoor',
            badge: 'Books',
            icon: '📚',
            imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80'
        },
        {
            id: 6,
            title: t.facilityMedical,
            desc: t.facilityMedicalDesc,
            category: 'indoor',
            badge: 'Care',
            icon: '🩺',
            imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
        }
    ];

    const filtered = selectedTab === 'all' 
        ? facilities 
        : facilities.filter(f => f.category === selectedTab);

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
                <div className={`text-center mb-5 ${styles.sectionTitle} ${styles.fadeUp}`}>
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

                    {/* Filter Tabs */}
                    <div className="flex justify-content-center gap-2 mt-4 flex-wrap">
                        {[
                            { key: 'all', label: lang === 'vi' ? 'Tất cả không gian' : 'All Areas' },
                            { key: 'indoor', label: lang === 'vi' ? 'Trong lớp học' : 'Indoor Rooms' },
                            { key: 'outdoor', label: lang === 'vi' ? 'Khu ngoài trời' : 'Outdoor Spaces' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedTab(tab.key as any)}
                                className="px-4 py-2 border-round-3xl font-bold transition-all transition-duration-200 border-none cursor-pointer"
                                style={{
                                    background: selectedTab === tab.key ? '#ff2f92' : '#ffffff',
                                    color: selectedTab === tab.key ? '#ffffff' : '#554751',
                                    boxShadow: selectedTab === tab.key 
                                        ? '0 8px 20px rgba(255,47,146,.3)' 
                                        : '0 4px 12px rgba(0,0,0,.05)'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Lưới hình ảnh cơ sở vật chất */}
                <div className="grid">
                    {filtered.map((item) => (
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
                                {/* Khung ảnh LazyImage */}
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
                                            color: '#ff2f92',
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