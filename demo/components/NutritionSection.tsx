'use client';

import React from 'react';
import styles from '../../app/(landing)/landing/landing.module.scss';
import { landingText, type LandingLanguage } from '../../app/(landing)/landing/lang';

interface NutritionSectionProps {
    lang: LandingLanguage;
}

export default function NutritionSection({ lang }: NutritionSectionProps) {
    const t = landingText[lang];

    const meals = [
        {
            time: '07:30',
            icon: '🥣',
            title: t.breakfastTitle,
            desc: t.breakfastDesc,
            color: '#ff8a00',
            bg: '#fff9f0'
        },
        {
            time: '09:30',
            icon: '🥛',
            title: t.morningSnackTitle,
            desc: t.morningSnackDesc,
            color: '#23b7ff',
            bg: '#f0f9ff'
        },
        {
            time: '11:00',
            icon: '🍱',
            title: t.lunchTitle,
            desc: t.lunchDesc,
            color: '#00c896',
            bg: '#f0fdf9'
        },
        {
            time: '14:30',
            icon: '🍮',
            title: t.afternoonSnackTitle,
            desc: t.afternoonSnackDesc,
            color: '#ff2f92',
            bg: '#fff0f7'
        }
    ];

    const commitments = [
        {
            icon: '🥦',
            title: t.commit1Title,
            desc: t.commit1Desc,
            tag: 'VietGAP'
        },
        {
            icon: '🛡️',
            title: t.commit2Title,
            desc: t.commit2Desc,
            tag: 'Safety 24H'
        },
        {
            icon: '🩺',
            title: t.commit3Title,
            desc: t.commit3Desc,
            tag: 'Healthcare'
        }
    ];

    return (
        <section
            id="nutrition"
            className={`px-4 py-8 relative ${styles.pinkSection} ${styles.colorfulSection} ${styles.sectionMotion}`}
        >
            <div className={styles.sectionFloatingIcons} aria-hidden="true">
                <span className={`${styles.sectionIcon} ${styles.sectionIcon1}`}>🥗</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon2}`}>🍎</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon3}`}>🥛</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon4}`}>🥑</span>
            </div>

            <div style={{ maxWidth: '1180px', margin: '0 auto' }} className={styles.sectionContentMotion}>
                {/* Title */}
                <div className={`text-center mb-6 ${styles.sectionTitle} ${styles.fadeUp}`}>
                    <div
                        className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3 ${styles.badgeCandy}`}
                        style={{
                            background: '#fff',
                            color: '#ff8a00',
                            boxShadow: '0 8px 18px rgba(255,138,0,.18)'
                        }}
                    >
                        {t.nutritionBadge}
                    </div>

                    <h2
                        className="m-0 mb-3"
                        style={{
                            fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.03em'
                        }}
                    >
                        {t.nutritionTitle}
                    </h2>

                    <p className="text-600 text-lg line-height-3 m-0" style={{ maxWidth: 640, margin: '0 auto' }}>
                        {t.nutritionDesc}
                    </p>
                </div>

                {/* 3 Cam kết cốt lõi */}
                <div className="grid mb-6">
                    {commitments.map((item, idx) => (
                        <div key={idx} className="col-12 md:col-4 p-3">
                            <div
                                className={`card h-full p-4 text-center ${styles.cardHover}`}
                                style={{
                                    borderRadius: 24,
                                    background: '#ffffff',
                                    border: '2px solid #ffe1f0',
                                    boxShadow: '0 12px 28px rgba(255,47,146,.08)'
                                }}
                            >
                                <div className="text-4xl mb-3">{item.icon}</div>
                                <span
                                    className="font-bold text-xs px-3 py-1 border-round-2xl inline-block mb-2"
                                    style={{ background: '#ffeaf4', color: '#ff2f92' }}
                                >
                                    {item.tag}
                                </span>
                                <h3 className="text-xl font-bold mb-2 m-0" style={{ color: '#2b232a' }}>
                                    {item.title}
                                </h3>
                                <p className="text-600 line-height-3 m-0 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lịch trình 4 bữa ăn */}
                <div
                    className="p-4 md:p-6"
                    style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 32,
                        border: '3px dashed #ffd86f',
                        boxShadow: '0 16px 40px rgba(255,216,111,.15)'
                    }}
                >
                    <h3 className="text-center text-2xl md:text-3xl font-bold mb-5 m-0" style={{ color: '#3b2f39' }}>
                        🍽️ {t.mealScheduleTitle}
                    </h3>

                    <div className="grid">
                        {meals.map((meal, index) => (
                            <div key={index} className="col-12 sm:col-6 lg:col-3 p-2">
                                <div
                                    className={`card h-full p-4 ${styles.cardHover}`}
                                    style={{
                                        borderRadius: 22,
                                        background: meal.bg,
                                        border: `2px solid ${meal.color}33`,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <div className="flex align-items-center justify-content-between mb-3">
                                        <span style={{ fontSize: '2rem' }}>{meal.icon}</span>
                                        <span
                                            className="px-3 py-1 border-round-3xl font-bold text-sm"
                                            style={{ background: meal.color, color: '#fff' }}
                                        >
                                            {meal.time}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 m-0" style={{ color: '#2b232a' }}>
                                        {meal.title}
                                    </h4>
                                    <p className="text-600 line-height-3 m-0 text-sm flex-1">
                                        {meal.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}