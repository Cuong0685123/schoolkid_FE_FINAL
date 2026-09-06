'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Carousel } from 'primereact/carousel';
import { createApplication } from '../../../demo/service/ApplicationService';
import { getPrograms } from '../../../demo/service/ProgramService';
import { getNewsArticles, type NewsArticle } from '../../../demo/service/NewsArticleService';
import { getPromotionalVideos, normalizeDriveThumbnailUrl, getYoutubeEmbedUrl, type PromotionalVideo } from '../../../demo/service/PromotionalVideoService';
import { createNewsletterSubscriber } from '../../../demo/service/NewsletterService';
import { getSiteContents, type SiteContent } from '../../../demo/service/SiteContentService';
import { useRouter } from 'next/navigation';
import { landingText } from './lang';
import styles from './landing.module.scss';
import Image from 'next/image';
import LazyImage from '../../../demo/components/LazyImage';
import HighlightsSection from '../../../demo/components/HighlightsSection';
import FacilitiesSection from '../../../demo/components/FacilitiesSection';
import NutritionSection from '../../../demo/components/NutritionSection';
import TuitionSection from '../../../demo/components/TuitionSection';
import GoogleMapEmbed from '../../../demo/components/GoogleMapEmbed';

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
    pink: '#ff2f92',
    yellow: '#ffcf24',
    green: '#00c896',
    blue: '#23b7ff',
    purple: '#9b5cff',
    orange: '#ff8a00',
    cream: '#fff7e8',
    lightPink: '#ffe1f0',
    lightYellow: '#fff2a8',
    lightGreen: '#d8fff3'
};

const sectionStyle: React.CSSProperties = {
    maxWidth: '1240px',
    margin: '0 auto'
};

const buttonPink: React.CSSProperties = {
    background: COLORS.pink,
    borderColor: COLORS.pink,
    fontWeight: 700
};

const buttonYellow: React.CSSProperties = {
    background: COLORS.yellow,
    borderColor: COLORS.yellow,
    color: '#6b3b00',
    fontWeight: 700
};

const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(2.35rem, 4.8vw, 4.2rem)',
    fontWeight: 900,
    lineHeight: 1.18,
    letterSpacing: '-0.035em'
};

const getProgramChildren = (programs: ProgramRow[]) => {
    const education = programs.flatMap((item) => item.ProgramEdus || []);
    const sport = programs.flatMap((item) => item.ProgramSports || []);
    return [...education, ...sport];
};

const getTeachers = (programs: ProgramRow[]) => {
    return programs.flatMap((item) => item.ProgramTeachers || []);
};

const SectionTitle = ({ badge, title, desc }: { badge?: string; title: string; desc?: string }) => (
    <div className={`text-center mb-6 flex flex-column align-items-center ${styles.sectionTitle} ${styles.fadeUp}`}>
        {badge ? (
            <div
                className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3 ${styles.badgeCandy}`}
                style={{ background: '#fff', color: COLORS.pink, boxShadow: '0 8px 18px rgba(255,95,162,.16)' }}
            >
                {badge}
            </div>
        ) : null}

        <h2 className="m-0 mb-3 text-center w-full" style={{ ...titleStyle, fontSize: 'clamp(2.1rem, 3.8vw, 3.5rem)' }}>
            {title}
        </h2>

        {desc ? (
            <p
                className="text-700 text-lg line-height-3 mx-auto my-0 text-center font-normal"
                style={{ maxWidth: 740, lineHeight: 1.75 }}
            >
                {desc}
            </p>
        ) : null}
    </div>
);

const DecorativeBubble = ({ style }: { style: React.CSSProperties }) => (
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

const SectionFloatingIcons = ({ icons }: { icons: string[] }) => (
    <div className={styles.sectionFloatingIcons} aria-hidden="true">
        {icons.map((icon, index) => (
            <span key={`${icon}-${index}`} className={`${styles.sectionIcon} ${styles[`sectionIcon${index + 1}`] || ''}`}>
                {icon}
            </span>
        ))}
    </div>
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

    const getImageUrl = (url?: string, width = 400) => {
        if (!url) return '';
        const idMatch = url.match(/[?&]id=([^&]+)/) || url.match(/\/file\/d\/([^/]+)/) || url.match(/\/d\/([^/]+)/);
        if (!idMatch) return url;
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w${width}`;
    };

    const featuredPrograms = getProgramChildren(programs);
    const teachers = getTeachers(programs);
    const latestNews = articles.slice(0, 3);
    const latestVideo = videos[0];

    // Lấy URL ảnh của giáo viên tải lên, nếu không có thì để rỗng (không dùng ảnh mẫu)
    const teacherGroupImageUrl = teachers.find((tc) => tc.profile_image_url)?.profile_image_url;

    const displayPrograms = featuredPrograms;

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
                    minHeight: 390,
                    background: 'linear-gradient(180deg,#ffffff 0%,#fff0fb 100%)',
                    border: '3px solid #ffc1e3',
                    boxShadow: '0 16px 35px rgba(255,47,146,.16)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '24px'
                }}
            >
                <div>
                    {item.thumbnail_url && (
                        <div style={{ position: 'relative', width: '100%', height: 180, marginBottom: 16 }}>
                            <Image
                                src={getImageUrl(item.thumbnail_url)}
                                alt={item.title}
                                fill
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: 20
                                }}
                            />
                        </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2 text-900">{item.title || t.programAlt}</h3>
                    <p className="text-700 line-height-3 text-sm m-0" style={{ lineHeight: 1.65 }}>
                        {item.detail || t.programFallbackDetail}
                    </p>
                </div>
                <div className="mt-3">
                    <Button
                        className={styles.buttonPop}
                        label={t.viewDetail}
                        rounded
                        text
                        style={{ color: COLORS.pink, fontWeight: 800 }}
                        onClick={() => router.push(`/landing/programs/${item.program_id || item.id}`)}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.landingRoot} style={{ background: COLORS.cream, color: '#2b232a', overflow: 'hidden' }}>
            <Toast ref={toast} />

            {/* Header: Thanh điều hướng rộng rãi, chống rớt dòng tuyệt đối */}
            <header
                className={`fixed top-0 left-0 right-0 z-5 ${styles.glassHeader}`}
                style={{
                    background: 'rgba(255,255,255,.96)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid #ffc1df'
                }}
            >
                <div className="flex align-items-center justify-content-between px-3 md:px-4 py-3" style={sectionStyle}>
                    {/* Logo & Slogan */}
                    <div className="flex align-items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => scrollTo('home')}>
                        <div
                            className={`border-circle flex align-items-center justify-content-center ${styles.logoPulse}`}
                            style={{
                                width: 46,
                                height: 46,
                                background: `linear-gradient(135deg,${COLORS.yellow},${COLORS.pink},${COLORS.purple})`,
                                color: '#fff',
                                boxShadow: '0 8px 18px rgba(255,47,146,.25)'
                            }}
                        >
                            <i className="pi pi-sun text-2xl" />
                        </div>

                        <div>
                            <div className="font-black text-xl md:text-2xl" style={{ color: '#2b232a', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                                {t.brandName}
                            </div>
                            <div className="text-xs font-bold hidden sm:block" style={{ color: COLORS.green, whiteSpace: 'nowrap' }}>
                                {t.slogan}
                            </div>
                        </div>
                    </div>

                    {/* Menu Navigation: Đảm bảo không bao giờ gãy dòng */}
                    <nav className="hidden lg:flex gap-2 xl:gap-4 align-items-center flex-nowrap mx-2">
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('home')}>
                            {t.navHome}
                        </button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('about')}>
                            {t.navAbout}
                        </button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('programs')}>
                            {t.navPrograms}
                        </button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('facilities')}>
                            {t.navFacilities}
                        </button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('tuition')}>
                            {t.navTuition}
                        </button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('news')}>
                            {t.navNews}
                        </button>
                        <button className={`p-link ${styles.navLink}`} onClick={() => scrollTo('contact')}>
                            {t.navContact}
                        </button>
                    </nav>

                    {/* Nút Đổi Ngôn Ngữ & Đăng Ký */}
                    <div className="flex align-items-center gap-2 flex-shrink-0">
                        <Button
                            label={lang === 'vi' ? 'EN' : 'VI'}
                            rounded
                            outlined
                            style={{ color: COLORS.pink, borderColor: COLORS.pink, fontWeight: 800, padding: '8px 16px' }}
                            onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                        />
                        <Button
                            label={t.applyNow}
                            rounded
                            style={{ ...buttonPink, whiteSpace: 'nowrap', padding: '10px 22px' }}
                            onClick={() => scrollTo('apply')}
                        />
                    </div>
                </div>
            </header>

            <main id="home" style={{ paddingTop: 84 }}>
                {/* 1. Hero Section */}
                <section
                    className={`px-4 py-8 relative ${styles.heroSection} ${styles.sectionMotion}`}
                    style={{
                        background: `linear-gradient(135deg, ${COLORS.lightPink} 0%, ${COLORS.lightYellow} 45%, ${COLORS.lightGreen} 100%)`
                    }}
                >
                    <DecorativeBubble style={{ width: 260, height: 260, background: COLORS.pink, top: -90, right: -80 }} />
                    <DecorativeBubble style={{ width: 160, height: 160, background: COLORS.blue, bottom: 30, left: -50 }} />
                    <DecorativeBubble style={{ width: 90, height: 90, background: COLORS.yellow, top: 140, left: '48%' }} />
                    <div className={`${styles.firework} ${styles.fireworkOne}`} />
                    <div className={`${styles.firework} ${styles.fireworkTwo}`} />
                    <div className={`${styles.firework} ${styles.fireworkThree}`} />
                    <div className={`${styles.confettiDot} ${styles.dotOne}`} />
                    <div className={`${styles.confettiDot} ${styles.dotTwo}`} />
                    <div className={`${styles.confettiDot} ${styles.dotThree}`} />

                    <div className={`grid align-items-center relative z-1 ${styles.sectionContentMotion}`} style={sectionStyle}>
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

                            <p className="text-xl text-700 mb-5 font-normal" style={{ lineHeight: 1.75, maxWidth: 540 }}>
                                {t.heroDesc}
                            </p>

                            <div className="flex gap-3 flex-wrap">
                                <Button
                                    className={styles.buttonPop}
                                    label={t.admission}
                                    rounded
                                    icon="pi pi-send"
                                    style={{ ...buttonYellow, padding: '14px 28px', fontSize: '1.05rem' }}
                                    onClick={() => scrollTo('apply')}
                                />
                                <Button
                                    className={styles.buttonPop}
                                    label={t.viewPrograms}
                                    rounded
                                    outlined
                                    icon="pi pi-arrow-right"
                                    style={{ color: COLORS.pink, borderColor: COLORS.pink, fontWeight: 700, padding: '14px 28px' }}
                                    onClick={() => scrollTo('programs')}
                                />
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
                                    src={latestVideo?.thumbnail_image_url ? normalizeDriveThumbnailUrl(latestVideo.thumbnail_image_url) : ''}
                                    referrerPolicy="no-referrer"
                                    alt={latestVideo?.title || t.brandName}
                                    style={{
                                        width: '100%',
                                        height: 'clamp(260px, 52vw, 460px)',
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Điểm nổi bật (Highlights) */}
                <HighlightsSection lang={lang} />

                {/* 3. Chương trình đào tạo (Programs) */}
                <section id="programs" className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection} ${styles.sectionMotion}`}>
                    <SectionFloatingIcons icons={['🎈', '🌸', '⭐', '🧸']} />
                    <div className={styles.sectionContentMotion} style={sectionStyle}>
                        <SectionTitle badge={t.programsBadge} title={t.programsTitle} desc={t.programsDesc} />

                        <Carousel
                            value={displayPrograms}
                            numVisible={3}
                            numScroll={1}
                            circular
                            autoplayInterval={3500}
                            showIndicators
                            showNavigators={false}
                            responsiveOptions={[
                                { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
                                { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
                                { breakpoint: '768px', numVisible: 1, numScroll: 1 },
                                { breakpoint: '480px', numVisible: 1, numScroll: 1 }
                            ]}
                            itemTemplate={programTemplate}
                        />
                    </div>
                </section>

                {/* 4. Về nhà trường & Triết lý giáo dục (About) */}
                <section id="about" className={`px-4 py-8 relative ${styles.aboutSection} ${styles.softSection} ${styles.sectionMotion}`}>
                    <SectionFloatingIcons icons={['☁️', '💖', '🌼', '🌈']} />
                    <DecorativeBubble style={{ width: 180, height: 180, background: COLORS.yellow, top: 40, right: -50 }} />

                    <div className={`grid align-items-center relative z-1 ${styles.sectionContentMotion}`} style={sectionStyle}>
                        <div className="col-12 lg:col-6">
                            <div
                                className="overflow-hidden"
                                style={{
                                    borderRadius: '45% 55% 55% 45%',
                                    border: '10px solid #fff',
                                    boxShadow: '0 20px 45px rgba(25,199,159,.18)'
                                }}
                            >
                                <img
                                    className={styles.imageHover}
                                    src={latestVideo?.thumbnail_image_url ? normalizeDriveThumbnailUrl(latestVideo.thumbnail_image_url) : ''}
                                    referrerPolicy="no-referrer"
                                    alt={latestVideo?.title || t.brandName}
                                    style={{
                                        width: '100%',
                                        height: 480,
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-12 lg:col-6 pl-lg-5">
                            <div
                                className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3 ${styles.badgeCandy}`}
                                style={{ background: '#fff', color: COLORS.green }}
                            >
                                {lang === 'vi' ? 'Triết Lý Giáo Dục' : 'Our Philosophy'}
                            </div>

                            <h2 className="m-0 mb-4" style={{ ...titleStyle, fontSize: 'clamp(2.1rem, 3.8vw, 3.6rem)' }}>
                                {t.aboutTitle}
                            </h2>

                            <p className="text-700 text-lg line-height-3 mb-4 font-normal" style={{ lineHeight: 1.8 }}>
                                {siteContent?.about_section_quote || t.aboutDefaultQuote}
                            </p>

                            <p className="text-600 line-height-3 text-base mb-5" style={{ lineHeight: 1.75 }}>
                                {lang === 'vi'
                                    ? 'Tại Nắng Hồng, mỗi ngày của bé là một hành trình kỳ diệu. Chúng tôi kết hợp nhuần nhuyễn giữa phương pháp giáo dục trực quan, nề nếp kỷ luật tích cực và những cái ôm vỗ về đầy kiên nhẫn. Sự phát triển tự nhiên, khỏe mạnh và hạnh phúc của bé chính là thước đo thành công lớn nhất của nhà trường.'
                                    : 'At Nang Hong, each day is a magical journey. We seamlessly combine intuitive learning, positive discipline, and warm patient care. A child’s natural, healthy, and joyous growth remains our greatest measure of success.'}
                            </p>

                            <div className="grid">
                                {[
                                    { value: siteContent?.stat_years_experience || '14+', label: t.yearsExperience, color: COLORS.green },
                                    { value: siteContent?.stat_students_info || '500+', label: t.studentsPerYear, color: COLORS.yellow },
                                    { value: siteContent?.stat_awards_info || '20+', label: t.achievements, color: COLORS.pink }
                                ].map((item) => (
                                    <div key={item.label} className="col-4">
                                        <div
                                            className={`card text-center h-full p-3 ${styles.cardHover}`}
                                            style={{ borderRadius: 24, background: '#fff', border: '2px solid #fff' }}
                                        >
                                            <div className="font-black text-3xl md:text-4xl" style={{ color: item.color }}>
                                                {item.value}
                                            </div>
                                            <div className="text-600 text-xs md:text-sm font-semibold mt-2">{item.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Đội ngũ giáo viên - Khung ảnh khổ lớn, căn trọn vẹn khuôn mặt */}
                <section id="teachers" className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection} ${styles.sectionMotion}`}>
                    <SectionFloatingIcons icons={['🎨', '🧸', '🌟', '💛']} />
                    <div className={styles.sectionContentMotion} style={sectionStyle}>
                        <SectionTitle badge={t.teachersBadge} title={t.teachersTitle} desc={t.teachersDesc} />

                        <div className="flex justify-content-center">
                            <div
                                className={`card p-3 md:p-4 text-center ${styles.cardHover} ${styles.rainbowCard}`}
                                style={{
                                    maxWidth: 1140,
                                    width: '100%',
                                    borderRadius: 36,
                                    background: '#ffffff',
                                    border: '3px solid #a7fff0',
                                    boxShadow: '0 20px 48px rgba(0,200,150,.18)'
                                }}
                            >
                                {teacherGroupImageUrl ? (
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            borderRadius: 26,
                                            overflow: 'hidden',
                                            background: '#f8fafc'
                                        }}
                                    >
                                        <img
                                            className={styles.imageHover}
                                            src={getImageUrl(teacherGroupImageUrl, 1600)}
                                            alt={t.teachersTitle}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                maxHeight: '750px',
                                                objectFit: 'contain',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            minHeight: 280,
                                            borderRadius: 26,
                                            background: 'linear-gradient(135deg, #f0fdf4 0%, #fff1f2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px dashed #bbf7d0'
                                        }}
                                    >
                                        <span className="text-600 font-medium text-base">
                                            {lang === 'vi' ? 'Đang cập nhật hình ảnh tập thể...' : 'Loading faculty photograph...'}
                                        </span>
                                    </div>
                                )}

                                <div className="p-3 mt-3">
                                    <h3 className="m-0 text-xl md:text-2xl font-black text-900 mb-2">
                                        {lang === 'vi' 
                                            ? 'Tập Thể Cán Bộ & Giáo Viên Mầm Non Nắng Hồng' 
                                            : 'Faculty & Educators of Nang Hong Kindergarten'}
                                    </h3>
                                    <p className="m-0 text-600 text-sm md:text-base font-medium line-height-3 mx-auto" style={{ maxWidth: 720 }}>
                                        {lang === 'vi'
                                            ? 'Đội ngũ giáo viên trẻ trung, tâm huyết, được đào tạo bài bản về chuyên môn và kỹ năng sơ cấp cứu, luôn đồng hành cùng bé bằng tất cả tình yêu thương và sự kiên nhẫn.'
                                            : 'A dedicated and certified team of educators, equipped with preschool pedagogy and first-aid skills, accompanying children with boundless patience and genuine love.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Cơ sở vật chất (Facilities) */}
                <FacilitiesSection lang={lang} getImageUrl={getImageUrl} />

                {/* 7. Chế độ dinh dưỡng & Sức khỏe (Nutrition) */}
                <NutritionSection lang={lang} />

                {/* 8. Học phí minh bạch (Tuition) */}
                <TuitionSection lang={lang} onApplyClick={() => scrollTo('apply')} />

                {/* 9. Video thực tế tại trường (Video) */}
                <section
                    id="video"
                    className={`px-4 py-8 ${styles.videoSection} ${styles.sectionMotion}`}
                    style={{ background: `linear-gradient(135deg,${COLORS.green},${COLORS.blue},${COLORS.purple})` }}
                >
                    <SectionFloatingIcons icons={['🎬', '✨', '☁️', '💙']} />
                    <div className={`grid align-items-center text-white ${styles.sectionContentMotion}`} style={sectionStyle}>
                        <div className="col-12 lg:col-5">
                            <h2 className="m-0 mb-3" style={{ ...titleStyle, fontSize: 'clamp(2.1rem, 3.8vw, 3.8rem)' }}>
                                {t.videoTitle}
                            </h2>
                            <p className="text-lg mb-4 font-normal" style={{ lineHeight: 1.75, opacity: 0.95 }}>
                                {t.videoDesc}
                            </p>

                            {latestVideo ? (
                                <Button
                                    label={t.openVideo}
                                    rounded
                                    severity="warning"
                                    icon="pi pi-play"
                                    style={{ fontWeight: 800, padding: '12px 28px' }}
                                    onClick={() => window.open(latestVideo.video_url, '_blank')}
                                />
                            ) : null}
                        </div>

                        <div className="col-12 lg:col-7">
                            <div
                                className={`card ${styles.videoCard}`}
                                style={{
                                    borderRadius: 28,
                                    overflow: 'hidden',
                                    border: '4px solid rgba(255,255,255,0.85)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,.25)'
                                }}
                            >
                                {latestVideo ? (
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: 420,
                                            borderRadius: 20,
                                            overflow: 'hidden',
                                            background: '#000'
                                        }}
                                    >
                                        {latestVideo?.video_url && (
                                            <iframe
                                                src={getYoutubeEmbedUrl(latestVideo.video_url)}
                                                title={latestVideo.title}
                                                allowFullScreen
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    border: 'none',
                                                    display: 'block'
                                                }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <p className="p-4 text-center">{t.noVideo}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10. Form Tuyển sinh & Tư vấn (Apply) */}
                <section id="apply" className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection} ${styles.sectionMotion}`}>
                    <SectionFloatingIcons icons={['📝', '💌', '🌸', '⭐']} />
                    <div
                        className={`p-5 md:p-6 ${styles.applyBox}`}
                        style={{
                            ...sectionStyle,
                            borderRadius: 36,
                            background: `linear-gradient(135deg,${COLORS.lightYellow},${COLORS.lightPink},${COLORS.lightGreen})`,
                            border: '3px dashed #ffc1dc',
                            boxShadow: '0 20px 48px rgba(255,95,162,.18)'
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

                                <h2 className="m-0 mb-3" style={{ ...titleStyle, fontSize: 'clamp(2.1rem, 3.8vw, 3.8rem)' }}>
                                    {t.applyTitle}
                                </h2>

                                <p className="text-700 text-lg mb-4 font-normal" style={{ lineHeight: 1.75 }}>
                                    {t.applyDescPrefix} <span className="font-bold text-pink-500">{siteContent?.admission_period || t.openNow}</span>. {t.applyDescSuffix}
                                </p>

                                <div className="p-3 border-round-2xl surface-card inline-block text-sm text-700 font-medium">
                                    📞 {lang === 'vi' ? 'Hotline hỗ trợ trực tiếp:' : 'Direct Hotline:'}{' '}
                                    <strong className="text-900">{siteContent?.phone_number || '012-345-6789'}</strong>
                                </div>
                            </div>

                            <div className="col-12 lg:col-7">
                                <div className={`card p-4 md:p-5 ${styles.cardHover}`} style={{ borderRadius: 28, background: '#fff' }}>
                                    <div className="grid">
                                        <div className="col-12 md:col-6">
                                            <label className="block mb-2 font-bold text-800">{t.parentName}</label>
                                            <InputText
                                                value={parentName}
                                                onChange={(event) => setParentName(event.target.value)}
                                                className="w-full"
                                                placeholder={t.parentNamePlaceholder}
                                            />
                                        </div>

                                        <div className="col-12 md:col-6">
                                            <label className="block mb-2 font-bold text-800">{t.phone}</label>
                                            <InputText
                                                value={parentPhone}
                                                onChange={(event) => setParentPhone(event.target.value)}
                                                className="w-full"
                                                placeholder={t.phonePlaceholder}
                                            />
                                        </div>

                                        <div className="col-12 md:col-6">
                                            <label className="block mb-2 font-bold text-800">{t.email}</label>
                                            <InputText
                                                value={parentEmail}
                                                onChange={(event) => setParentEmail(event.target.value)}
                                                className="w-full"
                                                placeholder={t.emailPlaceholder}
                                            />
                                        </div>

                                        <div className="col-12 md:col-6">
                                            <label className="block mb-2 font-bold text-800">{t.childName}</label>
                                            <InputText
                                                value={childName}
                                                onChange={(event) => setChildName(event.target.value)}
                                                className="w-full"
                                                placeholder={t.childNamePlaceholder}
                                            />
                                        </div>

                                        <div className="col-12 md:col-6">
                                            <label className="block mb-2 font-bold text-800">{t.childAge}</label>
                                            <InputText
                                                value={childAge}
                                                onChange={(event) => setChildAge(event.target.value)}
                                                className="w-full"
                                                placeholder={t.childAgePlaceholder}
                                            />
                                        </div>

                                        <div className="col-12 md:col-6">
                                            <label className="block mb-2 font-bold text-800">{t.programRequired}</label>
                                            <select
                                                value={selectedProgramId}
                                                onChange={(event) => setSelectedProgramId(event.target.value)}
                                                className="w-full p-inputtext p-component font-medium"
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
                                            <label className="block mb-2 font-bold text-800">{t.message}</label>
                                            <InputText
                                                value={message}
                                                onChange={(event) => setMessage(event.target.value)}
                                                className="w-full"
                                                placeholder={t.messagePlaceholder}
                                            />
                                        </div>

                                        <div className="col-12 mt-2">
                                            <Button
                                                label={t.submitApplication}
                                                icon="pi pi-send"
                                                rounded
                                                loading={applying}
                                                style={{ ...buttonPink, width: '100%', padding: '14px 28px', fontSize: '1.05rem' }}
                                                onClick={handleApply}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 11. Bảng tin hoạt động (News) */}
                <section id="news" className={`px-4 py-8 ${styles.newsSection} ${styles.sectionMotion}`} style={{ background: COLORS.lightPink }}>
                    <SectionFloatingIcons icons={['📰', '🎈', '💖', '🌼']} />
                    <div className={styles.sectionContentMotion} style={sectionStyle}>
                        <SectionTitle badge={t.newsBadge} title={t.newsTitle} desc={t.newsDesc} />

                        <div className="grid">
                            {latestNews.map((article) => (
                                <div key={article.id} className="col-12 md:col-4">
                                    <div
                                        className={`card h-full p-4 ${styles.cardHover} ${styles.rainbowCard}`}
                                        style={{
                                            borderRadius: 28,
                                            border: '3px solid #ffc1e3',
                                            boxShadow: '0 12px 28px rgba(255,47,146,.15)',
                                            background: '#fff',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div>
                                            {article.thumbnail_url ? (
                                                <div style={{ position: 'relative', width: '100%', height: 200, borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
                                                    <LazyImage
                                                        className={styles.imageHover}
                                                        src={getImageUrl(article.thumbnail_url, 450)}
                                                        alt={String(article.title || 'News thumbnail')}
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ) : null}

                                            <h3 className="text-xl font-bold mb-2 text-900 line-height-2">{article.title}</h3>
                                            <p className="text-600 text-sm mb-3" style={{ lineHeight: 1.65 }}>
                                                {article.content ? `${article.content.replace(/\s+/g, ' ').slice(0, 130)}...` : t.noContent}
                                            </p>
                                        </div>

                                        <div className="pt-2 border-top-1 border-100 flex align-items-center justify-content-between">
                                            <span className="text-xs text-500 font-medium">
                                                {t.byAuthor} {article.author_name || 'Admin'}
                                            </span>
                                            <Button
                                                label={t.readMore}
                                                icon="pi pi-arrow-right"
                                                text
                                                style={{ color: COLORS.pink, fontWeight: 800, padding: 0 }}
                                                onClick={() => router.push(`/landing/news/${article.id}`)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 12. Bản tin điện tử (Newsletter) */}
                <section className={`px-4 py-8 ${styles.softSection} ${styles.sectionMotion}`}>
                    <SectionFloatingIcons icons={['📬', '⭐', '💛', '☁️']} />
                    <div
                        className={`p-5 md:p-6 text-white ${styles.newsletterBox} ${styles.sectionContentMotion}`}
                        style={{
                            ...sectionStyle,
                            borderRadius: 36,
                            background: `linear-gradient(135deg,${COLORS.pink},${COLORS.orange},${COLORS.yellow},${COLORS.green},${COLORS.blue})`,
                            boxShadow: '0 18px 45px rgba(255,95,162,.22)'
                        }}
                    >
                        <div className="grid align-items-center">
                            <div className="col-12 lg:col-6">
                                <h2 className="text-3xl md:text-4xl font-black mt-0 mb-2">{t.newsletterTitle}</h2>
                                <p className="text-base md:text-lg m-0 font-medium opacity-90" style={{ lineHeight: 1.6 }}>
                                    {t.newsletterDesc}
                                </p>
                            </div>

                            <div className="col-12 lg:col-6">
                                <div className="flex flex-column sm:flex-row gap-2">
                                    <InputText
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder={t.newsletterPlaceholder}
                                        className="w-full"
                                        style={{ padding: '14px 20px', borderRadius: 24 }}
                                    />
                                    <Button
                                        label={t.subscribe}
                                        rounded
                                        severity="warning"
                                        loading={subscribing}
                                        style={{ fontWeight: 800, padding: '14px 28px', whiteSpace: 'nowrap' }}
                                        onClick={handleSubscribe}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 13. Bản đồ vị trí khuôn viên trường */}
                <GoogleMapEmbed lang={lang} siteContent={siteContent} />
            </main>

            {/* Footer */}
            <footer id="contact" className={`px-4 py-7 bg-white ${styles.footerGlow} ${styles.sectionMotion}`}>
                <SectionFloatingIcons icons={['🌻', '☁️', '💗', '⭐']} />
                <div className={`grid ${styles.sectionContentMotion}`} style={sectionStyle}>
                    <div className="col-12 md:col-4 pr-md-4">
                        <div className="flex align-items-center gap-2 mb-3">
                            <div
                                className="border-circle flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40, background: COLORS.pink, color: '#fff' }}
                            >
                                <i className="pi pi-sun text-xl" />
                            </div>
                            <h2 className="m-0 text-2xl font-bold" style={{ color: '#2b232a' }}>
                                {t.brandName}
                            </h2>
                        </div>
                        <p className="text-600 line-height-3 text-sm font-normal" style={{ lineHeight: 1.75 }}>
                            {siteContent?.footer_description || t.footerDefault}
                        </p>
                    </div>

                    <div className="col-12 md:col-4">
                        <h3 className="text-lg font-bold mb-3 text-900">{t.quickLinks}</h3>
                        <div className="flex flex-column gap-2 text-sm text-600 font-medium">
                            <span className="cursor-pointer hover:text-pink-500 transition-colors" onClick={() => scrollTo('about')}>
                                {t.footerAbout}
                            </span>
                            <span className="cursor-pointer hover:text-pink-500 transition-colors" onClick={() => scrollTo('programs')}>
                                {t.footerPrograms}
                            </span>
                            <span className="cursor-pointer hover:text-pink-500 transition-colors" onClick={() => scrollTo('facilities')}>
                                {t.navFacilities}
                            </span>
                            <span className="cursor-pointer hover:text-pink-500 transition-colors" onClick={() => scrollTo('tuition')}>
                                {t.navTuition}
                            </span>
                            <span className="cursor-pointer hover:text-pink-500 transition-colors" onClick={() => scrollTo('news')}>
                                {t.footerNews}
                            </span>
                            <span className="cursor-pointer hover:text-pink-500 transition-colors" onClick={() => scrollTo('contact')}>
                                {t.footerContact}
                            </span>
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <h3 className="text-lg font-bold mb-3 text-900">{t.contactTitle}</h3>
                        <div className="flex flex-column gap-3 text-sm text-700">
                            <div className="flex align-items-start gap-2">
                                <i className="pi pi-map-marker text-pink-500 mt-1" />
                                <span className="line-height-3">{siteContent?.address || t.defaultAddress}</span>
                            </div>
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-phone text-green-500" />
                                <a href={`tel:${siteContent?.phone_number || '0123456789'}`} className="text-700 no-underline font-semibold hover:underline">
                                    {siteContent?.phone_number || '012-345-6789'}
                                </a>
                            </div>
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-envelope text-blue-500" />
                                <span>{siteContent?.support_email || 'support@nanghong.edu.vn'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}