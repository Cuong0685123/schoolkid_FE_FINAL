'use client';

import React from 'react';
import { Button } from 'primereact/button';
import styles from '../../app/(landing)/landing/landing.module.scss';
import { landingText, type LandingLanguage } from '../../app/(landing)/landing/lang';
import type { SiteContent } from '../service/SiteContentService';

interface GoogleMapEmbedProps {
    lang: LandingLanguage;
    siteContent: SiteContent | null;
}

export default function GoogleMapEmbed({ lang, siteContent }: GoogleMapEmbedProps) {
    const t = landingText[lang];

    const address = siteContent?.address || t.defaultAddress || 'Thành Phố Hồ Chí Minh, Việt Nam';
    const encodedAddress = encodeURIComponent(address);
    // Link iframe Google Maps Embed chuẩn hóa miễn phí, không cần API key
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    return (
        <section
            id="location"
            className={`px-4 py-8 relative ${styles.softSection} ${styles.sectionMotion}`}
        >
            <div className={styles.sectionFloatingIcons} aria-hidden="true">
                <span className={`${styles.sectionIcon} ${styles.sectionIcon1}`}>📍</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon2}`}>🏫</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon3}`}>🚗</span>
                <span className={`${styles.sectionIcon} ${styles.sectionIcon4}`}>🌸</span>
            </div>

            <div style={{ maxWidth: '1180px', margin: '0 auto' }} className={styles.sectionContentMotion}>
                {/* Header */}
                <div className={`text-center mb-6 ${styles.sectionTitle} ${styles.fadeUp}`}>
                    <div
                        className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3 ${styles.badgeCandy}`}
                        style={{
                            background: '#fff',
                            color: '#00c896',
                            boxShadow: '0 8px 18px rgba(0,200,150,.18)'
                        }}
                    >
                        {t.mapBadge}
                    </div>

                    <h2
                        className="m-0 mb-3"
                        style={{
                            fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.03em'
                        }}
                    >
                        {t.mapTitle}
                    </h2>

                    <p className="text-600 text-lg line-height-3 m-0" style={{ maxWidth: 640, margin: '0 auto' }}>
                        {t.mapDesc}
                    </p>
                </div>

                {/* Box hiển thị Bản đồ + Thông tin liên hệ nhanh */}
                <div
                    className="grid overflow-hidden align-items-stretch"
                    style={{
                        background: '#ffffff',
                        borderRadius: 32,
                        border: '3px solid #e1fbf4',
                        boxShadow: '0 20px 50px rgba(0,200,150,.12)'
                    }}
                >
                    {/* Cột trái: Iframe Bản đồ */}
                    <div className="col-12 lg:col-8 p-0" style={{ minHeight: 380 }}>
                        <iframe
                            title="Nang Hong Kindergarten Location"
                            src={mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{
                                border: 'none',
                                minHeight: 400,
                                display: 'block'
                            }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* Cột phải: Thông tin địa chỉ & Giờ làm việc */}
                    <div className="col-12 lg:col-4 p-5 flex flex-column justify-content-between" style={{ background: '#fafefe' }}>
                        <div>
                            <div className="flex align-items-center gap-2 mb-4">
                                <span style={{ fontSize: '1.8rem' }}>🏫</span>
                                <h3 className="m-0 text-2xl font-bold" style={{ color: '#2b232a' }}>
                                    {t.brandName}
                                </h3>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm font-bold text-500 mb-1">{t.mapAddressLabel}</div>
                                <div className="text-800 font-semibold line-height-3 flex align-items-start gap-2">
                                    <i className="pi pi-map-marker text-red-500 mt-1" />
                                    <span>{address}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm font-bold text-500 mb-1">{t.phone}</div>
                                <div className="text-800 font-semibold flex align-items-center gap-2">
                                    <i className="pi pi-phone text-green-500" />
                                    <a
                                        href={`tel:${siteContent?.phone_number || '0123456789'}`}
                                        className="text-800 no-underline hover:underline"
                                    >
                                        {siteContent?.phone_number || '012-345-6789'}
                                    </a>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm font-bold text-500 mb-1">{t.email}</div>
                                <div className="text-800 font-semibold flex align-items-center gap-2">
                                    <i className="pi pi-envelope text-blue-500" />
                                    <span>{siteContent?.support_email || 'support@nanghong.edu.vn'}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm font-bold text-500 mb-1">{t.mapWorkingHoursLabel}</div>
                                <div className="text-700 text-sm line-height-3 flex align-items-start gap-2">
                                    <i className="pi pi-clock text-orange-500 mt-1" />
                                    <span>{t.mapWorkingHoursValue}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            label={t.mapGetDirections}
                            icon="pi pi-external-link"
                            rounded
                            outlined
                            style={{
                                color: '#00c896',
                                borderColor: '#00c896',
                                fontWeight: 700
                            }}
                            onClick={() => window.open(googleMapsDirectUrl, '_blank')}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}