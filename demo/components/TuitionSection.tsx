'use client';

import React from 'react';
import { Button } from 'primereact/button';
import styles from '../../app/(landing)/landing/landing.module.scss';
import { landingText, type LandingLanguage } from '../../app/(landing)/landing/lang';

interface TuitionSectionProps {
    lang: LandingLanguage;
    onApplyClick?: () => void;
}

export default function TuitionSection({ lang, onApplyClick }: TuitionSectionProps) {
    const t = landingText[lang];

    return (
        <section
            id="tuition"
            className={`px-4 py-8 relative ${styles.softSection} ${styles.sectionMotion}`}
        >
            <div className={styles.sectionFloatingIcons} aria-hidden="true">
                <span className={`${styles.sectionIcon} ${styles.sectionIcon1}`}>⭐</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon2}`}>🎈</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon3}`}>🌸</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon4}`}>💖</span>
            </div>

            <div style={{ maxWidth: '820px', margin: '0 auto' }} className={styles.sectionContentMotion}>
                {/* Header */}
                <div className={`text-center mb-5 ${styles.sectionTitle} ${styles.fadeUp}`}>
                    <div
                        className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3 ${styles.badgeCandy}`}
                        style={{
                            background: '#fff',
                            color: '#ff2f92',
                            boxShadow: '0 8px 18px rgba(255,47,146,.18)'
                        }}
                    >
                        {t.tuitionBadge}
                    </div>

                    <h2
                        className="m-0 mb-3"
                        style={{
                            fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.03em'
                        }}
                    >
                        {t.tuitionTitle}
                    </h2>

                    <p className="text-600 text-lg line-height-3 mx-auto my-0" style={{ maxWidth: 580 }}>
                        {t.tuitionDesc}
                    </p>
                </div>

                {/* Card Học phí duy nhất */}
                <div
                    className={`card p-5 md:p-6 text-center ${styles.cardHover} ${styles.rainbowCard}`}
                    style={{
                        borderRadius: 32,
                        background: 'linear-gradient(180deg, #ffffff 0%, #fff7fb 100%)',
                        border: '3px solid #ffc1e3',
                        boxShadow: '0 18px 45px rgba(255,47,146,.14)'
                    }}
                >
                    <span
                        className="px-4 py-1 border-round-2xl font-bold text-sm inline-block mb-3"
                        style={{ background: '#ffeaf4', color: '#ff2f92' }}
                    >
                        {lang === 'vi' ? 'Lớp Mầm • Chồi • Lá (3 - 5 tuổi)' : 'Mam • Choi • La Classes (3 - 5 Years Old)'}
                    </span>

                    <div className="flex align-items-baseline justify-content-center gap-2 my-2 flex-wrap">
                        <span
                            className="text-4xl md:text-6xl font-black"
                            style={{ color: '#ff2f92', letterSpacing: '-0.02em' }}
                        >
                            {t.tuitionRangePrice}
                        </span>
                        <span className="text-700 text-xl font-bold">{t.tuitionMonth}</span>
                    </div>

                    <p className="text-600 font-medium my-3">
                        {lang === 'vi'
                            ? 'Mức học phí áp dụng đồng đều cho các khối lớp học tại trường'
                            : 'Standard tuition rate across preschool classes'}
                    </p>

                    <div className="mt-4">
                        <Button
                            label={t.applyNow}
                            icon="pi pi-send"
                            rounded
                            style={{
                                background: '#ff2f92',
                                borderColor: '#ff2f92',
                                fontWeight: 800,
                                padding: '12px 32px',
                                boxShadow: '0 8px 22px rgba(255,47,146,.3)'
                            }}
                            onClick={onApplyClick}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}