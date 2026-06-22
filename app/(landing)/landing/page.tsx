'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Carousel } from 'primereact/carousel';
import { createApplication } from '../../../demo/service/ApplicationService';
import { getPrograms } from '../../../demo/service/ProgramService';
import { getNewsArticles, type NewsArticle } from '../../../demo/service/NewsArticleService';
import {
    getPromotionalVideos,
    normalizeDriveThumbnailUrl,
    getYoutubeEmbedUrl,
    type PromotionalVideo
} from '../../../demo/service/PromotionalVideoService';
import { createNewsletterSubscriber } from '../../../demo/service/NewsletterService';
import { getSiteContents, type SiteContent } from '../../../demo/service/SiteContentService';
import { useRouter } from 'next/navigation';
import { landingText } from './lang';
import styles from './landing.module.scss';
type ProgramRow = {
    id: number | string;
    name?: string;
    description?: string;
    type?: string;
    ProgramEdus?: any[];
    ProgramSports?: any[];
    ProgramTeachers?: any[];
};

const COLORS = {
    pink: '#ff4fa3',
    yellow: '#ffd85c',
    green: '#27d3aa',
    blue: '#75d9ff',
    purple: '#ff8fc7',
    orange: '#ffad5f',
    cream: '#fff0f7',
    lightPink: '#ffe6f2',
    lightYellow: '#fff4bd',
    lightGreen: '#e9fbff'
};

const sectionStyle: React.CSSProperties = {
    maxWidth: '1180px',
    margin: '0 auto'
};

const buttonPink: React.CSSProperties = {
    background: `linear-gradient(135deg, ${COLORS.pink}, #f72585)`,
    borderColor: COLORS.pink,
    fontWeight: 800,
    boxShadow: '0 12px 28px rgba(255,79,163,.28)'
};

const buttonYellow: React.CSSProperties = {
    background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.orange})`,
    borderColor: COLORS.yellow,
    color: '#6b3b00',
    fontWeight: 800,
    boxShadow: '0 12px 28px rgba(255,173,95,.26)'
};

const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(2.5rem, 5.4vw, 5rem)',
    fontWeight: 950,
    lineHeight: 1.06,
    letterSpacing: '-0.045em'
};

const getProgramChildren = (programs: ProgramRow[]) => {
    const education = programs.flatMap((item) => item.ProgramEdus || []);
    const sport = programs.flatMap((item) => item.ProgramSports || []);
    return [...education, ...sport];
};

const getTeachers = (programs: ProgramRow[]) => {
    return programs.flatMap((item) => item.ProgramTeachers || []);
};

const SectionTitle = ({
    badge,
    title,
    desc
}: {
    badge?: string;
    title: string;
    desc?: string;
}) => (
    <div className={`text-center mb-5 ${styles.sectionTitle} ${styles.fadeUp}`}>
        {badge ? (
            <div
                className="inline-block px-4 py-2 border-round-3xl font-bold mb-3"
                style={{ background: COLORS.lightYellow, color: COLORS.pink }}
            >
                {badge}
            </div>
        ) : null}

        <h2 className="m-0 mb-3" style={{ ...titleStyle, fontSize: 'clamp(2.2rem, 4vw, 4rem)' }}>
            {title}
        </h2>

        {desc ? <p className="text-600 text-lg line-height-3 m-0">{desc}</p> : null}
    </div>
);

const DecorativeBubble = ({
    style
}: {
    style: React.CSSProperties;
}) => (
    <div
        className={styles.bubbleDrift}
        style={{
            position: 'absolute',
            borderRadius: '999px',
            opacity: 0.72,
            zIndex: 0,
            ...style
        }}
    />
);

export default function NangHongLandingPage() {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [lang, setLang] = useState<'vi' | 'en'>('vi');
    const t = landingText[lang];
    const [programs, setPrograms] = useState<ProgramRow[]>([]);
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [videos, setVideos] = useState<PromotionalVideo[]>([]);
    const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const [applying, setApplying] = useState(false);
    const [parentName, setParentName] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState('');
    const [selectedProgramId, setSelectedProgramId] = useState('');
    const [message, setMessage] = useState('');
    const [showFirework, setShowFirework] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            const [programData, articleData, videoData, siteData] = await Promise.all([
                getPrograms(),
                getNewsArticles(),
                getPromotionalVideos(),
                getSiteContents()
            ]);

            setPrograms(Array.isArray(programData) ? programData : []);
            setArticles(Array.isArray(articleData) ? articleData : []);
            setVideos(Array.isArray(videoData) ? videoData : []);
            setSiteContent(Array.isArray(siteData) && siteData.length > 0 ? siteData[0] : null);
        };

        loadData().catch(() => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: t.loadError,
                life: 3000
            });
        });
    }, []);

    const featuredPrograms = getProgramChildren(programs);
    const teachers = getTeachers(programs);
    const latestNews = articles.slice(0, 3);
    const latestVideo = videos[0];

    const displayPrograms =
        featuredPrograms.length > 0
            ? featuredPrograms
            : [
                  {
                      id: 'p1',
                      title: t.fallbackProgramTitle1,
                      detail: t.fallbackProgramDetail1,
                      thumbnail_url: ''
                  },
                  {
                      id: 'p2',
                      title: t.fallbackProgramTitle2,
                      detail: t.fallbackProgramDetail2,
                      thumbnail_url: ''
                  },
                  {
                      id: 'p3',
                      title: t.fallbackProgramTitle3,
                      detail: t.fallbackProgramDetail3,
                      thumbnail_url: ''
                  }
              ];

    const displayTeachers =
        teachers.length > 0
            ? teachers
            : [
                  { id: 't1', full_name: t.fallbackTeacher1, role: t.kindergartenTeacher, profile_image_url: '' },
                  { id: 't2', full_name: t.fallbackTeacher2, role: t.talentTeacher, profile_image_url: '' },
                  { id: 't3', full_name: t.fallbackTeacher3, role: t.careTeacher, profile_image_url: '' },
                  { id: 't4', full_name: t.fallbackTeacher4, role: t.classTeacher, profile_image_url: '' }
              ];

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const handleSubscribe = async () => {
        if (!email.trim()) return;

        try {
            setSubscribing(true);
            await createNewsletterSubscriber({ email: email.trim() });
            setEmail('');

            toast.current?.show({
                severity: 'success',
                summary: t.subscribeSuccessSummary,
                detail: t.subscribeSuccessDetail,
                life: 3000
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: t.errorSummary,
                detail: t.subscribeError,
                life: 3000
            });
        } finally {
            setSubscribing(false);
        }
    };
    const handleApply = async () => {
    if (!parentName.trim() || !parentPhone.trim() || !childName.trim()) {
        toast.current?.show({
            severity: 'warn',
            summary: t.applyMissingSummary,
            detail: t.applyMissingDetail,
            life: 3000
        });
        return;

    }
    if (!selectedProgramId) {
    toast.current?.show({
        severity: 'warn',
        summary: t.applyMissingProgramSummary,
        detail: t.applyMissingProgramDetail,
        life: 3000
    });
    return;
}

    try {
        setApplying(true);

       await createApplication({
    parent_name: parentName.trim(),
    parent_phone: parentPhone.trim(),
    parent_email: parentEmail.trim(),
    child_name: childName.trim(),
    child_age: Number(childAge) || undefined,
    program_id: Number(selectedProgramId),
    message: message.trim()
});

        toast.current?.show({
            severity: 'success',
            summary: t.applySuccessSummary,
            detail: t.applySuccessDetail,
            life: 3000
        });

        setShowFirework(true);
        window.setTimeout(() => setShowFirework(false), 1900);

        setParentName('');
        setParentPhone('');
        setParentEmail('');
        setChildName('');
        setChildAge('');
        setMessage('');
    } catch {
        toast.current?.show({
            severity: 'error',
            summary: t.errorSummary,
            detail: t.applyError,
            life: 3000
        });
    } finally {
        setApplying(false);
    }
};

    const programTemplate = (item: any) => (
        <div className="p-3">
            <div
                className={`card text-center h-full ${styles.cardHover} ${styles.rainbowCard}`}
                style={{
                    borderRadius: 32,
                    minHeight: 350,
                    background: 'linear-gradient(180deg,#ffffff 0%,#fff0fb 100%)',
                    border: '3px solid #ffc1e3',
                    boxShadow: '0 16px 35px rgba(255,47,146,.22)'
                }}
            >
                {item.thumbnail_url ? (
                    <img
                        className={styles.imageHover}
                        src={item.thumbnail_url}
                        alt={item.title || t.programAlt}
                        style={{
                            width: '100%',
                            height: 170,
                            objectFit: 'cover',
                            borderRadius: 24,
                            marginBottom: 18
                        }}
                    />
                ) : (
                    <div
                        className="border-circle mx-auto mb-4 flex align-items-center justify-content-center"
                        style={{
                            width: 105,
                            height: 105,
                            background: COLORS.lightYellow,
                            color: COLORS.yellow,
                            border: '5px solid #fff'
                        }}
                    >
                        <i className="pi pi-sun text-5xl" />
                    </div>
                )}

                <h3 className="text-2xl mb-2">{item.title || t.programAlt}</h3>

                <p className="text-600 line-height-3">
                    {item.detail || t.programFallbackDetail}
                </p>

                <Button
    className={styles.buttonPop}
    label={t.viewDetail}
    rounded
    text
    style={{ color: COLORS.pink }}
    onClick={() =>
        router.push(`/landing/programs/${item.program_id || item.id}`)
    }
/>
            </div>
        </div>
    );

    const teacherTemplate = (teacher: any) => (
        <div className="p-3">
            <div
                className={`card text-center h-full ${styles.cardHover} ${styles.rainbowCard}`}
                style={{
                    borderRadius: 32,
                    minHeight: 350,
                    background: 'linear-gradient(180deg,#ffffff 0%,#efffff 100%)',
                    border: '3px solid #a7fff0',
                    boxShadow: '0 16px 35px rgba(0,200,150,.2)'
                }}
            >
                {teacher.profile_image_url ? (
                    <img
                        className={styles.imageHover}
                        src={teacher.profile_image_url}
                        alt={teacher.full_name || t.teacherAlt}
                        style={{
                            width: '100%',
                            height: 235,
                            objectFit: 'cover',
                            borderRadius: 26
                        }}
                    />
                ) : (
                    <div
                        className="mx-auto mb-4 border-circle flex align-items-center justify-content-center"
                        style={{
                            width: 145,
                            height: 145,
                            background: COLORS.lightPink,
                            color: COLORS.pink,
                            border: '6px solid #fff'
                        }}
                    >
                        <i className="pi pi-heart-fill text-5xl" />
                    </div>
                )}

                <h3 className="mb-1 text-2xl">{teacher.full_name || t.teacherAlt}</h3>
                <p className="text-600 m-0">{teacher.role || t.kindergartenTeacher}</p>
            </div>
        </div>
    );

    return (
        <div className={styles.landingRoot} style={{ color: '#263238', overflow: 'hidden' }}>
            <Toast ref={toast} />

            {showFirework ? (
                <div className={styles.fireworkOverlay}>
                    <div className={styles.boomOne} />
                    <div className={styles.boomTwo} />
                    <div className={styles.boomThree} />
                    <div className={`${styles.sparkleDot} ${styles.sparkleOne}`} />
                    <div className={`${styles.sparkleDot} ${styles.sparkleTwo}`} />
                    <div className={`${styles.sparkleDot} ${styles.sparkleThree}`} />
                    <div className={`${styles.sparkleDot} ${styles.sparkleFour}`} />
                    <div className={styles.fireworkMessage}>🎉 Đăng ký thành công!</div>
                </div>
            ) : null}

            <header
                className={`fixed top-0 left-0 right-0 z-5 ${styles.glassHeader}`}
                style={{
                    background: 'rgba(255, 240, 247, .82)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255, 79, 163, .16)'
                }}
            >
                <div className={`flex align-items-center justify-content-between px-4 py-3 ${styles.headerPill}`} style={sectionStyle}>
                    <div className="flex align-items-center gap-2">
                        <div
                            className={`border-circle flex align-items-center justify-content-center ${styles.logoPulse}`}
                            style={{
                                width: 46,
                                height: 46,
                                background: `linear-gradient(135deg,${COLORS.yellow},${COLORS.pink},${COLORS.blue})`,
                                color: '#fff'
                            }}
                        >
                            <i className="pi pi-sun text-xl" />
                        </div>

                        <div>
                            <div className="font-bold text-2xl">{t.brandName}</div>
                            <div className="text-sm font-semibold" style={{ color: COLORS.green }}>
                                {t.slogan}
                            </div>
                        </div>
                    </div>

                    <nav className="hidden md:flex gap-4 align-items-center font-semibold">
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('home')}>{t.navHome}</button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('about')}>{t.navAbout}</button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('programs')}>{t.navPrograms}</button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('news')}>{t.navNews}</button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('contact')}>{t.navContact}</button>
                    </nav>

                    <Button
                        label={lang === 'vi' ? 'EN' : 'VI'}
                        rounded
                        outlined
                        style={{ color: COLORS.pink, borderColor: COLORS.pink, fontWeight: 700 }}
                        onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                    />

                    <Button className={styles.buttonPop} label={t.applyNow} rounded style={buttonPink} onClick={() => scrollTo('apply')} />
                </div>
            </header>

            <main id="home" style={{ paddingTop: 84 }}>
                <section
                    className={`px-4 py-8 relative ${styles.heroSection}`}
                    style={{
                        background: `linear-gradient(135deg, #ffe8f3 0%, #fff2c8 58%, #e9f8ff 100%)`
                    }}
                >
                    <DecorativeBubble style={{ width: 260, height: 260, background: COLORS.pink, top: -90, right: -80 }} />
                    <DecorativeBubble style={{ width: 170, height: 170, background: COLORS.blue, bottom: 34, left: -54 }} />
                    <DecorativeBubble style={{ width: 100, height: 100, background: COLORS.yellow, top: 150, left: '48%' }} />
                    <div className={styles.cloudOne} />
                    <div className={styles.cloudTwo} />
                    <div className={styles.starOne}>✦</div>
                    <div className={styles.starTwo}>✦</div>
                    <div className={`${styles.cuteIcon} ${styles.iconSun}`}>🌞</div>
                    <div className={`${styles.cuteIcon} ${styles.iconFlower}`}>🌼</div>
                    <div className={`${styles.cuteIcon} ${styles.iconHeart}`}>💗</div>
                    <div className={`${styles.cuteIcon} ${styles.iconRocket}`}>🚀</div>

                    <div className="grid align-items-center relative z-1" style={sectionStyle}>
                        <div className={`col-12 lg:col-6 ${styles.fadeUp}`}>
                            <div
                                className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3 ${styles.badgeCandy}`}
                                style={{ background: '#fff', color: COLORS.pink, boxShadow: '0 8px 18px rgba(255,95,162,.18)' }}
                            >
                                {t.heroBadge}
                            </div>

                            <h1 className={`m-0 mb-4 ${styles.heroTitle}`} style={titleStyle}>
                                {t.heroTitle}
                            </h1>

                            <p className="text-xl line-height-3 text-700 mb-5">
                                {t.heroDesc}
                            </p>

                            <div className="flex gap-3 flex-wrap">
                                <Button className={styles.buttonPop} label={t.admission} rounded icon="pi pi-send" style={buttonYellow} onClick={() => scrollTo('apply')} />
                                <Button
                                    className={styles.buttonPop}
                                    label={t.viewPrograms}
                                    rounded
                                    outlined
                                    icon="pi pi-arrow-right"
                                    style={{ color: COLORS.pink, borderColor: COLORS.pink, fontWeight: 800, background: 'rgba(255,255,255,.74)' }}
                                    onClick={() => scrollTo('programs')}
                                />
                            </div>

                            <div className={`grid mt-5 ${styles.heroStats}`}>
                                {[
                                    { value: siteContent?.stat_years_experience || '10+', label: t.yearsExperience, icon: '💖', color: COLORS.pink },
                                    { value: siteContent?.stat_students_info || '500+', label: t.studentsPerYear, icon: '🌈', color: COLORS.blue },
                                    { value: siteContent?.stat_awards_info || '30+', label: t.achievements, icon: '⭐', color: COLORS.orange }
                                ].map((item) => (
                                    <div key={item.label} className="col-12 sm:col-4">
                                        <div className={styles.heroStatCard}>
                                            <div className={styles.heroStatIcon}>{item.icon}</div>
                                            <div className="font-bold text-2xl" style={{ color: item.color }}>{item.value}</div>
                                            <div className="text-600 text-sm mt-1">{item.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 lg:col-6">
                            <div
                                className={`relative overflow-hidden ${styles.floatSlow} ${styles.heroImageWrap}`}
                                style={{
                                    borderRadius: '45% 55% 48% 52%',
                                    border: '12px solid #ffffff',
                                    boxShadow: '0 24px 60px rgba(255,95,162,.25)'
                                }}
                            >
                                <img
                                    className={styles.imageHover}
                                    src={
                                        siteContent?.hero_image_url
                                            ? normalizeDriveThumbnailUrl(siteContent.hero_image_url)
                                            : '/layout/images/landing/landing-hero-image.jpg'
                                    }
                                    referrerPolicy="no-referrer"
                                    alt={t.brandName}
                                    style={{ width: '100%', height: 450, objectFit: 'cover', display: 'block' }}
                                />
                                <div className={`${styles.heroSticker} ${styles.heroStickerOne}`}>💛</div>
                                <div className={`${styles.heroSticker} ${styles.heroStickerTwo}`}>☀️</div>
                                <div className={styles.heroSpeech}>Mỗi ngày đến trường là một ngày vui ✨</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="programs" className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection}`}>
                    <div style={sectionStyle}>
                        <SectionTitle
                            badge={t.programsBadge}
                            title={t.programsTitle}
                            desc={t.programsDesc}
                        />

                        <Carousel
                            value={displayPrograms}
                            numVisible={3}
                            numScroll={1}
                            circular
                            autoplayInterval={3000}
                            showIndicators
                            showNavigators
                            responsiveOptions={[
                                { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
                                { breakpoint: '768px', numVisible: 1, numScroll: 1 }
                            ]}
                            itemTemplate={programTemplate}
                        />
                    </div>
                </section>

                <section id="about" className={`px-4 py-8 relative ${styles.aboutSection} ${styles.softSection}`}>
                    <DecorativeBubble style={{ width: 180, height: 180, background: COLORS.yellow, top: 40, right: -50 }} />

                    <div className="grid align-items-center relative z-1" style={sectionStyle}>
                        <div className="col-12 lg:col-6">
                            <div
                                className="overflow-hidden"
                                style={{
                                    borderRadius: '45% 55% 55% 45%',
                                    border: '10px solid #fff',
                                    boxShadow: '0 18px 40px rgba(25,199,159,.2)'
                                }}
                            >
                                <img
                                    className={styles.imageHover}
                                    src={
                                        siteContent?.about_image_url
                                            ? normalizeDriveThumbnailUrl(siteContent.about_image_url)
                                            : '/layout/images/landing/landing-hero-image.jpg'
                                    }
                                    referrerPolicy="no-referrer"
                                    alt={t.aboutAlt}
                                    style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                        </div>

                        <div className="col-12 lg:col-6">
                            <h2 className="m-0 mb-3" style={{ ...titleStyle, fontSize: 'clamp(2.2rem, 4vw, 4.2rem)' }}>
                                {t.aboutTitle}
                            </h2>

                            <p className="text-700 text-lg line-height-3">
                                {siteContent?.about_section_quote || t.aboutDefaultQuote}
                            </p>

                            <div className="grid mt-4">
                                {[
                                    { value: siteContent?.stat_years_experience || '14+', label: t.yearsExperience, color: COLORS.green },
                                    { value: siteContent?.stat_students_info || '500+', label: t.studentsPerYear, color: COLORS.yellow },
                                    { value: siteContent?.stat_awards_info || '20+', label: t.achievements, color: COLORS.pink }
                                ].map((item) => (
                                    <div key={item.label} className="col-4">
                                        <div className="card text-center h-full" style={{ borderRadius: 22 }}>
                                            <div className="font-bold text-4xl" style={{ color: item.color }}>{item.value}</div>
                                            <div className="text-600 mt-2">{item.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection}`}>
                    <div style={sectionStyle}>
                        <SectionTitle
                            badge={t.teachersBadge}
                            title={t.teachersTitle}
                            desc={t.teachersDesc}
                        />

                        <Carousel
                            value={displayTeachers}
                            numVisible={4}
                            numScroll={1}
                            circular
                            autoplayInterval={2500}
                            showIndicators
                            showNavigators
                            responsiveOptions={[
                                { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
                                { breakpoint: '768px', numVisible: 1, numScroll: 1 }
                            ]}
                            itemTemplate={teacherTemplate}
                        />
                    </div>
                </section>

                <section id="video" className={`px-4 py-8 ${styles.videoSection}`} style={{ background: `linear-gradient(135deg,${COLORS.green},${COLORS.blue},${COLORS.purple})` }}>
                    <div className="grid align-items-center text-white" style={sectionStyle}>
                        <div className="col-12 lg:col-5">
                            <h2 className="m-0 mb-3" style={{ ...titleStyle, fontSize: 'clamp(2.2rem, 4vw, 4rem)' }}>{t.videoTitle}</h2>
                            <p className="text-lg line-height-3">{t.videoDesc}</p>

                            {latestVideo ? (
                                <Button
                                    label={t.openVideo}
                                    rounded
                                    severity="warning"
                                    icon="pi pi-play"
                                    onClick={() => window.open(latestVideo.video_url, '_blank')}
                                />
                            ) : null}
                        </div>

                        <div className="col-12 lg:col-7">
                            <div className={`card ${styles.videoCard}`} style={{ borderRadius: 28 }}>
                                {latestVideo ? (
                                    <iframe
                                        src={getYoutubeEmbedUrl(latestVideo.video_url)}
                                        title={latestVideo.title}
                                        allowFullScreen
                                        style={{
                                            width: '100%',
                                            height: 420,
                                            border: 'none',
                                            borderRadius: 20,
                                            background: '#000'
                                        }}
                                    />
                                ) : (
                                    <p>{t.noVideo}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

<section id="apply" className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection}`}>
    <div
        className={`p-5 ${styles.applyBox}`}
        style={{
            ...sectionStyle,
            borderRadius: 36,
            background: `linear-gradient(135deg,#fff6c9,#ffe2f1,#e7f8ff)`,
            border: '3px dashed #ffc1dc',
            boxShadow: '0 18px 45px rgba(255,95,162,.16)'
        }}
    >
        <div className="grid align-items-center">
            <div className="col-12 lg:col-5">
                <div
                    className="inline-block px-4 py-2 border-round-3xl font-bold mb-3"
                    style={{ background: '#fff', color: COLORS.pink }}
                >
                    {t.applyBadge}
                </div>

                <h2
                    className="m-0 mb-3"
                    style={{
                        ...titleStyle,
                        fontSize: 'clamp(2.2rem, 4vw, 4rem)'
                    }}
                >
                    {t.applyTitle}
                </h2>

                <p className="text-700 text-lg line-height-3">
                    {t.applyDescPrefix}{' '}
                    {siteContent?.admission_period || t.openNow}.
                    {t.applyDescSuffix}
                </p>
            </div>

            <div className="col-12 lg:col-7">
                <div className="card" style={{ borderRadius: 28 }}>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <label className="block mb-2 font-bold">
                                {t.parentName}
                            </label>
                            <InputText
                                value={parentName}
                                onChange={(event) => setParentName(event.target.value)}
                                className="w-full"
                                placeholder={t.parentNamePlaceholder}
                            />
                        </div>

                        <div className="col-12 md:col-6">
                            <label className="block mb-2 font-bold">
                                {t.phone}
                            </label>
                            <InputText
                                value={parentPhone}
                                onChange={(event) => setParentPhone(event.target.value)}
                                className="w-full"
                                placeholder={t.phonePlaceholder}
                            />
                        </div>

                        <div className="col-12 md:col-6">
                            <label className="block mb-2 font-bold">
                                {t.email}
                            </label>
                            <InputText
                                value={parentEmail}
                                onChange={(event) => setParentEmail(event.target.value)}
                                className="w-full"
                                placeholder={t.emailPlaceholder}
                            />
                        </div>

                        <div className="col-12 md:col-6">
                            <label className="block mb-2 font-bold">
                                {t.childName}
                            </label>
                            <InputText
                                value={childName}
                                onChange={(event) => setChildName(event.target.value)}
                                className="w-full"
                                placeholder={t.childNamePlaceholder}
                            />
                        </div>

                        <div className="col-12 md:col-6">
                            <label className="block mb-2 font-bold">
                                {t.childAge}
                            </label>
                            <InputText
                                value={childAge}
                                onChange={(event) => setChildAge(event.target.value)}
                                className="w-full"
                                placeholder={t.childAgePlaceholder}
                            />
                        </div>
                        <div className="col-12 md:col-6"></div>
<div className="col-12 md:col-6">
    <label className="block mb-2 font-bold">
        {t.programRequired}
    </label>

    <select
        value={selectedProgramId}
        onChange={(event) => setSelectedProgramId(event.target.value)}
        className="w-full p-inputtext p-component"
    >
        <option value="">{t.selectProgram}</option>

        {programs.map((program) => (
            <option key={program.id} value={program.id}>
                {program.name}
            </option>
        ))}
    </select>
</div>
                        <div className="col-12">
                            <label className="block mb-2 font-bold">
                                {t.message}
                            </label>
                            <InputText
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                className="w-full"
                                placeholder={t.messagePlaceholder}
                            />
                        </div>

                        <div className="col-12">
                            <Button
                                className={styles.buttonPop}
                                label={t.submitApplication}
                                icon="pi pi-send"
                                rounded
                                loading={applying}
                                style={buttonPink}
                                onClick={handleApply}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

                <section id="news" className={`px-4 py-8 ${styles.newsSection}`} style={{ background: COLORS.lightPink }}>
                    <div style={sectionStyle}>
                        <SectionTitle
                            badge={t.newsBadge}
                            title={t.newsTitle}
                            desc={t.newsDesc}
                        />

                        <div className="grid">
                            {latestNews.map((article) => (
                                <div key={article.id} className="col-12 md:col-4">
                                    <div
                                        className={`card h-full ${styles.cardHover} ${styles.rainbowCard}`}
                                        style={{
                                            borderRadius: 28,
                                            border: '3px solid #ffc1e3',
                                            boxShadow: '0 12px 28px rgba(255,47,146,.18)'
                                        }}
                                    >
                                        {article.thumbnail_url ? (
                                            <img
                                                className={styles.imageHover}
                                                src={normalizeDriveThumbnailUrl(article.thumbnail_url)}
                                                alt={article.title}
                                                style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 22 }}
                                            />
                                        ) : null}

                                        <h3 className="text-2xl">{article.title}</h3>

                                        <p className="text-600 line-height-3">
                                            {article.content ? `${article.content.replace(/\s+/g, ' ').slice(0, 120)}...` : t.noContent}
                                        </p>

                                        <div className="text-sm text-500">
                                            {t.byAuthor} {article.author_name || 'Admin'}
                                        </div>
                                        <Button
    label={t.readMore}
    icon="pi pi-arrow-right"
    text
    className="mt-3"
    style={{ color: COLORS.pink }}
    onClick={() => router.push(`/landing/news/${article.id}`)}
/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={`px-4 py-8 ${styles.softSection}`}>
                    <div
                        className={`p-5 text-white ${styles.newsletterBox}`}
                        style={{
                            ...sectionStyle,
                            borderRadius: 36,
                            background: `linear-gradient(135deg,${COLORS.pink},${COLORS.orange},${COLORS.yellow},${COLORS.blue})`,
                            boxShadow: '0 18px 45px rgba(255,95,162,.22)'
                        }}
                    >
                        <div className="grid align-items-center">
                            <div className="col-12 lg:col-6">
                                <h2 className="text-4xl font-bold mt-0">{t.newsletterTitle}</h2>
                                <p className="text-lg">{t.newsletterDesc}</p>
                            </div>

                            <div className="col-12 lg:col-6">
                                <div className="flex flex-column sm:flex-row gap-2">
                                    <InputText
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder={t.newsletterPlaceholder}
                                        className="w-full"
                                    />

                                    <Button label={t.subscribe} rounded severity="warning" loading={subscribing} onClick={handleSubscribe} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer id="contact" className={`px-4 py-6 bg-white ${styles.footerGlow}`}>
                <div className="grid" style={sectionStyle}>
                    <div className="col-12 md:col-4">
                        <h2>{t.brandName}</h2>
                        <p className="text-600 line-height-3">
                            {siteContent?.footer_description || t.footerDefault}
                        </p>
                    </div>

                    <div className="col-12 md:col-4">
                        <h3>{t.quickLinks}</h3>
                        <p>{t.footerAbout}</p>
                        <p>{t.footerPrograms}</p>
                        <p>{t.footerNews}</p>
                        <p>{t.footerContact}</p>
                    </div>

                    <div className="col-12 md:col-4">
                        <h3>{t.contactTitle}</h3>
                        <p>{siteContent?.address || t.defaultAddress}</p>
                        <p>{siteContent?.phone_number || '012-345-6789'}</p>
                        <p>{siteContent?.support_email || 'support@nanghong.edu.vn'}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}