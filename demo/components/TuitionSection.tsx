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

    const plans = [
        {
            name: t.tuitionPlan1Name,
            price: t.tuitionPlan1Price,
            desc: t.tuitionPlan1Desc,
            color: '#ff2f92',
            badge: '12 - 24M',
            highlight: false
        },
        {
            name: t.tuitionPlan2Name,
            price: t.tuitionPlan2Price,
            desc: t.tuitionPlan2Desc,
            color: '#ff8a00',
            badge: '25 - 36M',
            highlight: true
        },
        {
            name: t.tuitionPlan3Name,
            price: t.tuitionPlan3Price,
            desc: t.tuitionPlan3Desc,
            color: '#00c896',
            badge: '3 - 5 Yrs',
            highlight: false
        }
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

            <div style={{ maxWidth: '1180px', margin: '0 auto' }} className={styles.sectionContentMotion}>
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

                {/* 3 Cột bảng giá */}
                <div className="grid align-items-stretch mb-5">
                    {plans.map((plan, index) => (
                        <div key={index} className="col-12 lg:col-4 p-3">
                            <div
                                className={`card h-full p-4 flex flex-column justify-content-between ${styles.cardHover} ${
                                    plan.highlight ? styles.rainbowCard : ''
                                }`}
                                style={{
                                    borderRadius: 30,
                                    background: '#ffffff',
                                    border: plan.highlight ? `3px solid ${plan.color}` : '2px solid rgba(0,0,0,0.06)',
                                    boxShadow: plan.highlight
                                        ? '0 20px 45px rgba(255,138,0,.22)'
                                        : '0 12px 30px rgba(0,0,0,.05)',
                                    transform: plan.highlight ? 'scale(1.02)' : 'none'
                                }}
                            >
                                <div>
                                    <div className="flex justify-content-between align-items-center mb-3">
                                        <span
                                            className="px-3 py-1 border-round-2xl font-bold text-xs"
                                            style={{
                                                background: `${plan.color}18`,
                                                color: plan.color
                                            }}
                                        >
                                            {plan.badge}
                                        </span>
                                        {plan.highlight && (
                                            <span
                                                className="px-3 py-1 border-round-2xl font-bold text-xs"
                                                style={{ background: '#ff8a00', color: '#fff' }}
                                            >
                                                Phổ biến nhất
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 m-0" style={{ color: '#2b232a' }}>
                                        {plan.name}
                                    </h3>

                                    <div className="my-3 flex align-items-baseline gap-1">
                                        <span className="text-4xl font-extrabold" style={{ color: plan.color }}>
                                            {plan.price}
                                        </span>
                                        <span className="text-600 text-sm">{t.tuitionMonth}</span>
                                    </div>

                                    <p className="text-600 line-height-3 text-sm mb-4">{plan.desc}</p>

                                    {/* Danh sách quyền lợi */}
                                    <div className="flex flex-column gap-2 mb-4 text-sm">
                                        {[
                                            t.tuitionFeatureMeal,
                                            t.tuitionFeatureCamera,
                                            t.tuitionFeatureInsurance,
                                            t.tuitionFeatureActivities
                                        ].map((feature, fIdx) => (
                                            <div key={fIdx} className="flex align-items-center gap-2">
                                                <i className="pi pi-check-circle" style={{ color: '#00c896' }} />
                                                <span className="text-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    label={t.applyNow}
                                    icon="pi pi-send"
                                    rounded
                                    style={{
                                        background: plan.highlight ? '#ff8a00' : plan.color,
                                        borderColor: plan.highlight ? '#ff8a00' : plan.color,
                                        fontWeight: 700
                                    }}
                                    onClick={onApplyClick}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Các khoản phí phụ trợ & Banner ưu đãi */}
                <div className="grid">
                    {/* Bảng phí khác */}
                    <div className="col-12 md:col-6 p-3">
                        <div
                            className="p-4 h-full"
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 24,
                                border: '2px solid #ffe5f1'
                            }}
                        >
                            <h4 className="m-0 mb-3 text-lg font-bold" style={{ color: '#ff2f92' }}>
                                📌 {t.tuitionFeeInclude}
                            </h4>
                            <div className="flex flex-column gap-3 text-sm">
                                <div className="flex justify-content-between border-bottom-1 border-100 pb-2">
                                    <span className="font-semibold text-700">{t.tuitionMealFeeTitle}</span>
                                    <span className="font-bold text-900">{t.tuitionMealFeeValue}</span>
                                </div>
                                <div className="flex justify-content-between border-bottom-1 border-100 pb-2">
                                    <span className="font-semibold text-700">{t.tuitionMaterialFeeTitle}</span>
                                    <span className="font-bold text-900">{t.tuitionMaterialFeeValue}</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span className="font-semibold text-700">{t.tuitionLateFeeTitle}</span>
                                    <span className="font-bold text-900">{t.tuitionLateFeeValue}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banner khuyến mãi */}
                    <div className="col-12 md:col-6 p-3">
                        <div
                            className={`p-4 h-full flex flex-column justify-content-between text-white ${styles.rainbowCard}`}
                            style={{
                                borderRadius: 24,
                                background: 'linear-gradient(135deg, #ff2f92 0%, #ff8a00 100%)',
                                boxShadow: '0 14px 30px rgba(255,47,146,.22)'
                            }}
                        >
                            <div>
                                <h4 className="m-0 mb-2 text-xl font-bold">{t.tuitionDiscountBannerTitle}</h4>
                                <p className="line-height-3 text-sm opacity-90 m-0">
                                    {t.tuitionDiscountBannerDesc}
                                </p>
                            </div>
                            <div className="mt-4">
                                <Button
                                    label={t.tuitionRegisterNow}
                                    icon="pi pi-arrow-right"
                                    rounded
                                    style={{
                                        background: '#ffffff',
                                        color: '#ff2f92',
                                        fontWeight: 800,
                                        border: 'none'
                                    }}
                                    onClick={onApplyClick}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}