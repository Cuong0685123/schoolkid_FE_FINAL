'use client';

import React from 'react';
import styles from '../landing.module.scss';
import { landingText, type LandingLanguage } from '../../app/(landing)/landing/lang'

interface HighlightsSectionProps {
    lang: LandingLanguage;
}

export default function HighlightsSection({ lang }: HighlightsSectionProps) {
    const t = landingText[lang];

    const highlights = [
        {
            icon: '🌱',
            title: t.highlight1Title,
            desc: t.highlight1Desc,
            color: '#ff2f92',
            bg: 'linear-gradient(180deg, #ffffff 0%, #fff0fb 100%)',
            border: '#ffc1e3'
        },
        {
            icon: '📹',
            title: t.highlight2Title,
            desc: t.highlight2Desc,
            color: '#23b7ff',
            bg: 'linear-gradient(180deg, #ffffff 0%, #effaff 100%)',
            border: '#a2e5ff'
        },
        {
            icon: '🌳',
            title: t.highlight3Title,
            desc: t.highlight3Desc,
            color: '#00c896',
            bg: 'linear-gradient(180deg, #ffffff 0%, #effffb 100%)',
            border: '#a5f3e2'
        },
        {
            icon: '🥗',
            title: t.highlight4Title,
            desc: t.highlight4Desc,
            color: '#ff8a00',
            bg: 'linear-gradient(180deg, #ffffff 0%, #fff8eb 100%)',
            border: '#ffd99f'
        },
        {
            icon: '🧸',
            title: t.highlight5Title,
            desc: t.highlight5Desc,
            color: '#9b5cff',
            bg: 'linear-gradient(180deg, #ffffff 0%, #f6f0ff 100%)',
            border: '#d7bcff'
        },
        {
            icon: '🩺',
            title: t.highlight6Title,
            desc: t.highlight6Desc,
            color: '#ffcf24',
            bg: 'linear-gradient(180deg, #ffffff 0%, #fffde8 100%)',
            border: '#ffefa1'
        }
    ];

    return (
        <section
            id="highlights"
            className={`px-4 py-8 relative ${styles.softSection} ${styles.sectionMotion}`}
        >
            <div className={styles.sectionFloatingIcons} aria-hidden="true">
                <span className={`${styles.sectionIcon} ${styles.sectionIcon1}`}>✨</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon2}`}>🎈</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon3}`}>🌟</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon4}`}>💖</span>
            </div>

            <div style={{ maxWidth: '1180px', margin: '0 auto' }} className={styles.sectionContentMotion}>
                <div className={`text-center mb-6 ${styles.sectionTitle} ${styles.fadeUp}`}>
                    <div
                        className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3 ${styles.badgeCandy}`}
                        style={{
                            background: '#fff',
                            color: '#ff2f92',
                            boxShadow: '0 8px 18px rgba(255,95,162,.18)'
                        }}
                    >
                        {t.highlightsBadge}
                    </div>

                    <h2
                        className="m-0 mb-3"
                        style={{
                            fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.03em'
                        }}
                    >
                        {t.highlightsTitle}
                    </h2>

                    <p className="text-600 text-lg line-height-3 m-0" style={{ maxWidth: 640, margin: '0 auto' }}>
                        {t.highlightsDesc}
                    </p>
                </div>

                <div className="grid">
                    {highlights.map((item, index) => (
                        <div key={index} className="col-12 sm:col-6 lg:col-4 p-3">
                            <div
                                className={`card h-full p-4 text-center ${styles.cardHover}`}
                                style={{
                                    borderRadius: 28,
                                    background: item.bg,
                                    border: `2px solid ${item.border}`,
                                    boxShadow: '0 14px 30px rgba(0,0,0,0.04)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start'
                                }}
                            >
                                <div
                                    className="flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: '50%',
                                        background: '#fff',
                                        fontSize: '2rem',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                                        border: `2px solid ${item.border}`
                                    }}
                                >
                                    {item.icon}
                                </div>

                                <h3
                                    className="text-xl font-bold mb-2 m-0"
                                    style={{ color: '#2b232a' }}
                                >
                                    {item.title}
                                </h3>

                                <p
                                    className="text-600 line-height-3 m-0 text-sm"
                                    style={{ color: '#554751' }}
                                >
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}