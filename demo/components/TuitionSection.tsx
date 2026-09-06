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

    const benefits = [
        t.tuitionFeatureMeal,
        t.tuitionFeatureCamera,
        t.tuitionFeatureInsurance,
        t.tuitionFeatureActivities
    ];

    return (
        <section
            id="tuition"
            className={`px-4 py-8 relative ${styles.softSection} ${styles.sectionMotion}`}
        >
            <div className={styles.sectionFloatingIcons} aria-hidden="true">
                <span className={`${styles.sectionIcon} ${styles.sectionIcon1}`}>🎁</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon2}`}>⭐</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon3}`}>🎈</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon4}`}>💖</span>
            </div>

            <div style={{ maxWidth: '1080px', margin: '0 auto' }} className={styles.sectionContentMotion}>
                {/* Header */}
                <div className={`text-center mb-6 ${styles.sectionTitle} ${styles.fadeUp}`}>
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

                    <p className="text-600 text-lg line-height-3 m-0" style={{ maxWidth: 640, margin: '0 auto' }}>
                        {t.tuitionDesc}
                    </p>
                </div>

                {/* Banner Học phí chính */}
                <div
                    className={`card mb-5 p-5 md:p-6 ${styles.cardHover} ${styles.rainbowCard}`}
                    style={{
                        borderRadius: 36,
                        background: 'linear-gradient(135deg, #ffffff 0%, #fff7fb 100%)',
                        border: '3px solid #ffc1e3',
                        boxShadow: '0 20px 48px rgba(255,47,146,.16)'
                    }}
                >
                    <div className="grid align-items-center">
                        <div className="col-12 lg:col-7">
                            <span
                                className="px-3 py-1 border-round-2xl font-bold text-xs inline-block mb-3"
                                style={{ background: '#ffeaf4', color: '#ff2f92' }}
                            >
                                Học phí chính khóa
                            </span>

                            <div className="flex align-items-baseline gap-2 mb-2 flex-wrap">
                                <span
                                    className="text-4xl md:text-5xl font-black"
                                    style={{ color: '#ff2f92', letterSpacing: '-0.02em' }}
                                >
                                    {t.tuitionRangePrice}
                                </span>
                                <span className="text-700 text-lg font-bold">{t.tuitionMonth}</span>
                            </div>

                            <p className="text-700 font-semibold mb-4 line-height-3">
                                {t.tuitionScope}
                            </p>

                            <div className="grid">
                                {benefits.map((benefit, idx) => (
                                    <div key={idx} className="col-12 sm:col-6 flex align-items-center gap-2 mb-2">
                                        <i className="pi pi-check-circle" style={{ color: '#00c896', fontSize: '1.2rem' }} />
                                        <span className="text-700 text-sm font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 lg:col-5 text-center lg:text-right mt-4 lg:mt-0">
                            <div
                                className="p-4 inline-block text-left w-full border-round-3xl"
                                style={{ background: 'rgba(255,255,255,0.85)', border: '2px dashed #ffd86f' }}
                            >
                                <div className="text-sm font-bold text-800 mb-2">📌 {t.tuitionFeeInclude}</div>
                                <div className="text-xs text-600 mb-2 flex justify-content-between">
                                    <span>{t.tuitionMealFeeTitle}</span>
                                    <span className="font-bold text-800">{t.tuitionMealFeeValue}</span>
                                </div>
                                <div className="text-xs text-600 mb-3 flex justify-content-between">
                                    <span>{t.tuitionMaterialFeeTitle}</span>
                                    <span className="font-bold text-800">{t.tuitionMaterialFeeValue}</span>
                                </div>
                                <Button
                                    label={t.tuitionRegisterNow}
                                    icon="pi pi-send"
                                    rounded
                                    className="w-full"
                                    style={{
                                        background: '#ff2f92',
                                        borderColor: '#ff2f92',
                                        fontWeight: 800,
                                        boxShadow: '0 8px 20px rgba(255,47,146,.3)'
                                    }}
                                    onClick={onApplyClick}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner Ưu đãi tuyển sinh */}
                <div
                    className="p-4 flex flex-column md:flex-row justify-content-between align-items-center gap-3 text-white"
                    style={{
                        borderRadius: 24,
                        background: 'linear-gradient(135deg, #ff8a00 0%, #ffd86f 100%)',
                        boxShadow: '0 12px 28px rgba(255,138,0,.2)'
                    }}
                >
                    <div>
                        <h4 className="m-0 mb-1 text-lg md:text-xl font-bold text-900">
                            {t.tuitionDiscountBannerTitle}
                        </h4>
                        <p className="m-0 text-sm text-800 font-medium">
                            {t.tuitionDiscountBannerDesc}
                        </p>
                    </div>
                    <Button
                        label={lang === 'vi' ? 'Nhận tư vấn ngay' : 'Get Details'}
                        icon="pi pi-arrow-right"
                        rounded
                        style={{
                            background: '#ffffff',
                            color: '#e67300',
                            border: 'none',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                        }}
                        onClick={onApplyClick}
                    />
                </div>
            </div>
        </section>
    );
}