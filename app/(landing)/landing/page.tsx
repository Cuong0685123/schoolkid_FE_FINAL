'use client';

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { landingText } from './lang';
import styles from './landing.module.scss';
import LazyImage from '../../../demo/components/LazyImage';
import HighlightsSection from '../../../demo/components/HighlightsSection';

// Các section nằm xa phía dưới: tách thành chunk riêng để giảm JS ban đầu.
// (Vẫn render SSR nên id="facilities", id="tuition"... luôn có trong HTML.)
const FacilitiesSection = dynamic(() => import('../../../demo/components/FacilitiesSection'));
const NutritionSection = dynamic(() => import('../../../demo/components/NutritionSection'));
const TuitionSection = dynamic(() => import('../../../demo/components/TuitionSection'));
const GoogleMapEmbed = dynamic(() => import('../../../demo/components/GoogleMapEmbed'));

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Lang = 'vi' | 'en';
type LandingText = (typeof landingText)[Lang];
type ToastSeverity = 'success' | 'info' | 'warn' | 'error';
type ShowToast = (severity: ToastSeverity, summary: string, detail: string) => void;

type ProgramRow = {
    id: number | string;
    name?: string;
    description?: string;
    type?: string;
    ProgramEdus?: any[];
    ProgramSports?: any[];
    ProgramTeachers?: any[];
};

type ProgramChild = Record<string, any>;

/* -------------------------------------------------------------------------- */
/*  Constants (khai báo ngoài component để không tạo lại mỗi lần render)       */
/* -------------------------------------------------------------------------- */

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

const HEADER_HEIGHT = 84;

const sectionStyle: React.CSSProperties = { maxWidth: '1240px', margin: '0 auto' };

const buttonPink: React.CSSProperties = { background: COLORS.pink, borderColor: COLORS.pink, fontWeight: 700 };
const buttonYellow: React.CSSProperties = { background: COLORS.yellow, borderColor: COLORS.yellow, color: '#6b3b00', fontWeight: 700 };

const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(2.35rem, 4.8vw, 4.2rem)',
    fontWeight: 900,
    lineHeight: 1.18,
    letterSpacing: '-0.035em'
};

const rootStyle: React.CSSProperties = { background: COLORS.cream, color: '#2b232a', overflow: 'hidden' };

const NAV_ITEMS = [
    { id: 'home', key: 'navHome' },
    { id: 'about', key: 'navAbout' },
    { id: 'programs', key: 'navPrograms' },
    { id: 'facilities', key: 'navFacilities' },
    { id: 'tuition', key: 'navTuition' },
    { id: 'news', key: 'navNews' },
    { id: 'contact', key: 'navContact' }
] as const;

const FOOTER_LINKS = [
    { id: 'about', key: 'footerAbout' },
    { id: 'programs', key: 'footerPrograms' },
    { id: 'facilities', key: 'navFacilities' },
    { id: 'tuition', key: 'navTuition' },
    { id: 'news', key: 'footerNews' },
    { id: 'contact', key: 'footerContact' }
] as const;

const ICONS = {
    programs: ['🎈', '🌸', '⭐', '🧸'],
    about: ['☁️', '💖', '🌼', '🌈'],
    teachers: ['🎨', '🧸', '🌟', '💛'],
    video: ['🎬', '✨', '☁️', '💙'],
    apply: ['📝', '💌', '🌸', '⭐'],
    news: ['📰', '🎈', '💖', '🌼'],
    newsletter: ['📬', '⭐', '💛', '☁️'],
    footer: ['🌻', '☁️', '💗', '⭐']
};

const CAROUSEL_RESPONSIVE = [
    { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
    { breakpoint: '480px', numVisible: 1, numScroll: 1 }
];

const sectionTitleStyle: React.CSSProperties = { ...titleStyle, fontSize: 'clamp(2.1rem, 3.8vw, 3.5rem)' };
const bigTitleStyle: React.CSSProperties = { ...titleStyle, fontSize: 'clamp(2.1rem, 3.8vw, 3.8rem)' };
const aboutTitleStyle: React.CSSProperties = { ...titleStyle, fontSize: 'clamp(2.1rem, 3.8vw, 3.6rem)' };

const HERO_IMAGE_HEIGHT = 'clamp(260px, 52vw, 460px)';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Chuyển link Google Drive thành link thumbnail. Chỉ đụng tới URL của Google,
 * URL khác (CDN, server riêng...) được giữ nguyên.
 */
const DRIVE_ID_PATTERNS = [/[?&]id=([^&]+)/, /\/file\/d\/([^/]+)/, /\/d\/([^/]+)/];

const getImageUrl = (url?: string, width = 400): string => {
    if (!url) return '';
    if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) return url;
    for (const pattern of DRIVE_ID_PATTERNS) {
        const match = url.match(pattern);
        if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w${width}`;
    }
    return url;
};

const getProgramChildren = (programs: ProgramRow[]): ProgramChild[] => [
    ...programs.flatMap((item) => item.ProgramEdus || []),
    ...programs.flatMap((item) => item.ProgramSports || [])
];

const getTeachers = (programs: ProgramRow[]): any[] => programs.flatMap((item) => item.ProgramTeachers || []);

function toArray<T>(data: unknown): T[] {
    return Array.isArray(data) ? (data as T[]) : [];
}

/* Cache localStorage: lần sau vào trang có dữ liệu (và URL ảnh) ngay, rồi làm mới ngầm. */
const CACHE_PREFIX = 'nanghong:landing:v1:';

const readCache = (key: string): string | null => {
    try {
        return window.localStorage.getItem(CACHE_PREFIX + key);
    } catch {
        return null;
    }
};

const writeCache = (key: string, serialized: string) => {
    try {
        window.localStorage.setItem(CACHE_PREFIX + key, serialized);
    } catch {
        /* hết dung lượng hoặc chế độ ẩn danh: bỏ qua */
    }
};

/* -------------------------------------------------------------------------- */
/*  Data hook                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Mỗi API tự cập nhật state của riêng nó (không còn Promise.all),
 * nên ảnh hero chỉ phụ thuộc API video chứ không phải chờ API chậm nhất.
 */
function useLandingData(onError: () => void) {
    const [programs, setPrograms] = useState<ProgramRow[]>([]);
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [videos, setVideos] = useState<PromotionalVideo[]>([]);
    const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    useEffect(() => {
        let cancelled = false;
        let errorShown = false;
        const cachedRaw: Record<string, string | null> = {};

        const hydrate = <T,>(key: string, apply: (value: T) => void) => {
            const raw = readCache(key);
            cachedRaw[key] = raw;
            if (!raw) return;
            try {
                apply(JSON.parse(raw) as T);
            } catch {
                /* cache hỏng: bỏ qua */
            }
        };

        const load = <T,>(key: string, request: Promise<unknown>, normalize: (data: unknown) => T, apply: (value: T) => void) => {
            request
                .then((data) => {
                    if (cancelled) return;
                    const value = normalize(data);
                    const serialized = JSON.stringify(value);
                    if (serialized === cachedRaw[key]) return; // giống cache: khỏi render lại
                    apply(value);
                    writeCache(key, serialized);
                })
                .catch(() => {
                    if (cancelled || errorShown) return;
                    errorShown = true; // chỉ báo lỗi 1 lần dù nhiều API lỗi
                    onErrorRef.current();
                });
        };

        // 1) Hiện ngay dữ liệu đã cache (nếu có)
        hydrate<PromotionalVideo[]>('videos', setVideos);
        hydrate<SiteContent | null>('site', setSiteContent);
        hydrate<ProgramRow[]>('programs', setPrograms);
        hydrate<NewsArticle[]>('articles', setArticles);

        // 2) Gọi API song song, video (ảnh hero) đứng đầu
        load('videos', getPromotionalVideos(), (d) => toArray<PromotionalVideo>(d), setVideos);
        load('site', getSiteContents(), (d) => (Array.isArray(d) && d.length > 0 ? (d[0] as SiteContent) : null), setSiteContent);
        load('programs', getPrograms(), (d) => toArray<ProgramRow>(d), setPrograms);
        load('articles', getNewsArticles(), (d) => toArray<NewsArticle>(d), setArticles);

        return () => {
            cancelled = true;
        };
    }, []);

    return { programs, articles, videos, siteContent };
}

/* -------------------------------------------------------------------------- */
/*  Small presentational components                                           */
/* -------------------------------------------------------------------------- */

const Badge = memo(function Badge({ children, color, shadow, candy = true }: { children: React.ReactNode; color: string; shadow?: string; candy?: boolean }) {
    return (
        <div
            className={`inline-block px-4 py-2 border-round-3xl font-bold mb-3${candy ? ` ${styles.badgeCandy}` : ''}`}
            style={{ background: '#fff', color, ...(shadow ? { boxShadow: shadow } : null) }}
        >
            {children}
        </div>
    );
});

const SectionTitle = memo(function SectionTitle({ badge, title, desc }: { badge?: string; title: string; desc?: string }) {
    return (
        <div className={`text-center mb-6 flex flex-column align-items-center ${styles.sectionTitle} ${styles.fadeUp}`}>
            {badge ? (
                <Badge color={COLORS.pink} shadow="0 8px 18px rgba(255,95,162,.16)">
                    {badge}
                </Badge>
            ) : null}

            <h2 className="m-0 mb-3 text-center w-full" style={sectionTitleStyle}>
                {title}
            </h2>

            {desc ? (
                <p className="text-700 text-lg line-height-3 mx-auto my-0 text-center font-normal" style={{ maxWidth: 740, lineHeight: 1.75 }}>
                    {desc}
                </p>
            ) : null}
        </div>
    );
});

const DecorativeBubble = ({ style }: { style: React.CSSProperties }) => (
    <div className={styles.bubbleDrift} style={{ position: 'absolute', borderRadius: '999px', opacity: 0.72, zIndex: 0, ...style }} />
);

const SectionFloatingIcons = memo(function SectionFloatingIcons({ icons }: { icons: string[] }) {
    return (
        <div className={styles.sectionFloatingIcons} aria-hidden="true">
            {icons.map((icon, index) => (
                <span key={`${icon}-${index}`} className={`${styles.sectionIcon} ${styles[`sectionIcon${index + 1}`] || ''}`}>
                    {icon}
                </span>
            ))}
        </div>
    );
});

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

const Header = memo(function Header({ t, lang, onToggleLang, onNavigate }: { t: LandingText; lang: Lang; onToggleLang: () => void; onNavigate: (id: string) => void }) {
    return (
        <header
            className={`fixed top-0 left-0 right-0 z-5 ${styles.glassHeader}`}
            // Nền đã gần đặc (.96) nên bỏ backdrop-filter: blur() vì rất tốn GPU khi cuộn.
            style={{ background: 'rgba(255,255,255,.96)', borderBottom: '1px solid #ffc1df' }}
        >
            <div className="flex align-items-center justify-content-between px-3 md:px-4 py-3" style={sectionStyle}>
                {/* Logo & Slogan */}
                <div className="flex align-items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => onNavigate('home')}>
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

                {/* Menu */}
                <nav className="hidden lg:flex gap-2 xl:gap-4 align-items-center flex-nowrap mx-2">
                    {NAV_ITEMS.map((item) => (
                        <button key={item.id} className={`p-link ${styles.navLink}`} onClick={() => onNavigate(item.id)}>
                            {t[item.key]}
                        </button>
                    ))}
                </nav>

                {/* Đổi ngôn ngữ & Đăng ký */}
                <div className="flex align-items-center gap-2 flex-shrink-0">
                    <Button
                        label={lang === 'vi' ? 'EN' : 'VI'}
                        rounded
                        outlined
                        style={{ color: COLORS.pink, borderColor: COLORS.pink, fontWeight: 800, padding: '8px 16px' }}
                        onClick={onToggleLang}
                    />
                    <Button label={t.applyNow} rounded style={{ ...buttonPink, whiteSpace: 'nowrap', padding: '10px 22px' }} onClick={() => onNavigate('apply')} />
                </div>
            </div>
        </header>
    );
});

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

const HeroSection = memo(function HeroSection({ t, heroSrc, heroAlt, onNavigate }: { t: LandingText; heroSrc: string; heroAlt: string; onNavigate: (id: string) => void }) {
    return (
        <section
            className={`px-4 py-8 relative ${styles.heroSection} ${styles.sectionMotion}`}
            style={{ background: `linear-gradient(135deg, ${COLORS.lightPink} 0%, ${COLORS.lightYellow} 45%, ${COLORS.lightGreen} 100%)` }}
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
                    <Badge color={COLORS.pink} shadow="0 8px 18px rgba(255,95,162,.18)">
                        {t.heroBadge}
                    </Badge>

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
                            onClick={() => onNavigate('apply')}
                        />
                        <Button
                            className={styles.buttonPop}
                            label={t.viewPrograms}
                            rounded
                            outlined
                            icon="pi pi-arrow-right"
                            style={{ color: COLORS.pink, borderColor: COLORS.pink, fontWeight: 700, padding: '14px 28px' }}
                            onClick={() => onNavigate('programs')}
                        />
                    </div>
                </div>

                <div className="col-12 lg:col-6">
                    <div
                        className={`relative overflow-hidden ${styles.floatSlow} ${styles.heroImageWrap}`}
                        style={{ borderRadius: '45% 55% 48% 52%', border: '12px solid #ffffff', boxShadow: '0 24px 60px rgba(255,95,162,.25)' }}
                    >
                        {/* Khung giữ chỗ cố định: không nhảy layout, có nền màu trong lúc chờ ảnh */}
                        <div style={{ position: 'relative', width: '100%', height: HERO_IMAGE_HEIGHT, background: COLORS.lightPink }}>
                            {heroSrc ? (
                                <Image
                                    className={styles.imageHover}
                                    src={heroSrc}
                                    alt={heroAlt}
                                    fill
                                    priority
                                    unoptimized
                                    sizes="(max-width: 992px) 100vw, 50vw"
                                    referrerPolicy="no-referrer"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

/* -------------------------------------------------------------------------- */
/*  Programs                                                                  */
/* -------------------------------------------------------------------------- */

const ProgramCard = memo(function ProgramCard({ item, t, onView }: { item: ProgramChild; t: LandingText; onView: (id: string | number) => void }) {
    return (
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
                            {/* unoptimized: Drive đã resize sẵn (sz=w400), bỏ được chặng trung gian qua server Next */}
                            <Image
                                src={getImageUrl(item.thumbnail_url, 400)}
                                alt={item.title || t.programAlt}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                referrerPolicy="no-referrer"
                                style={{ objectFit: 'cover', borderRadius: 20 }}
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
                        onClick={() => onView(item.program_id || item.id)}
                    />
                </div>
            </div>
        </div>
    );
});

const ProgramsSection = memo(function ProgramsSection({ t, items, onView }: { t: LandingText; items: ProgramChild[]; onView: (id: string | number) => void }) {
    const itemTemplate = useCallback((item: ProgramChild) => <ProgramCard item={item} t={t} onView={onView} />, [t, onView]);

    return (
        <section id="programs" className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection} ${styles.sectionMotion}`}>
            <SectionFloatingIcons icons={ICONS.programs} />
            <div className={styles.sectionContentMotion} style={sectionStyle}>
                <SectionTitle badge={t.programsBadge} title={t.programsTitle} desc={t.programsDesc} />

                <Carousel
                    value={items}
                    numVisible={3}
                    numScroll={1}
                    circular
                    autoplayInterval={3500}
                    showIndicators
                    showNavigators={false}
                    responsiveOptions={CAROUSEL_RESPONSIVE}
                    itemTemplate={itemTemplate}
                />
            </div>
        </section>
    );
});

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

const AboutSection = memo(function AboutSection({ t, lang, siteContent, imageSrc, imageAlt }: { t: LandingText; lang: Lang; siteContent: SiteContent | null; imageSrc: string; imageAlt: string }) {
    const stats = [
        { value: siteContent?.stat_years_experience || '14+', label: t.yearsExperience, color: COLORS.green },
        { value: siteContent?.stat_students_info || '500+', label: t.studentsPerYear, color: COLORS.yellow },
        { value: siteContent?.stat_awards_info || '20+', label: t.achievements, color: COLORS.pink }
    ];

    return (
        <section id="about" className={`px-4 py-8 relative ${styles.aboutSection} ${styles.softSection} ${styles.sectionMotion}`}>
            <SectionFloatingIcons icons={ICONS.about} />
            <DecorativeBubble style={{ width: 180, height: 180, background: COLORS.yellow, top: 40, right: -50 }} />

            <div className={`grid align-items-center relative z-1 ${styles.sectionContentMotion}`} style={sectionStyle}>
                <div className="col-12 lg:col-6">
                    <div
                        className="overflow-hidden"
                        style={{ borderRadius: '45% 55% 55% 45%', border: '10px solid #fff', boxShadow: '0 20px 45px rgba(25,199,159,.18)' }}
                    >
                        <div style={{ position: 'relative', width: '100%', height: 480, background: COLORS.lightGreen }}>
                            {imageSrc ? (
                                <Image
                                    className={styles.imageHover}
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 992px) 100vw, 50vw"
                                    referrerPolicy="no-referrer"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-6 pl-lg-5">
                    <Badge color={COLORS.green}>{lang === 'vi' ? 'Triết Lý Giáo Dục' : 'Our Philosophy'}</Badge>

                    <h2 className="m-0 mb-4" style={aboutTitleStyle}>
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
                        {stats.map((item) => (
                            <div key={item.label} className="col-4">
                                <div className={`card text-center h-full p-3 ${styles.cardHover}`} style={{ borderRadius: 24, background: '#fff', border: '2px solid #fff' }}>
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
    );
});

/* -------------------------------------------------------------------------- */
/*  Teachers                                                                  */
/* -------------------------------------------------------------------------- */

const TeachersSection = memo(function TeachersSection({ t, lang, imageUrl }: { t: LandingText; lang: Lang; imageUrl?: string }) {
    // Hiển thị tối đa ~1140px nên w1280 là đủ, nhẹ hơn nhiều so với w1600
    const src = useMemo(() => getImageUrl(imageUrl, 1280), [imageUrl]);

    return (
        <section id="teachers" className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection} ${styles.sectionMotion}`}>
            <SectionFloatingIcons icons={ICONS.teachers} />
            <div className={styles.sectionContentMotion} style={sectionStyle}>
                <SectionTitle badge={t.teachersBadge} title={t.teachersTitle} desc={t.teachersDesc} />

                <div className="flex justify-content-center">
                    <div
                        className={`card p-3 md:p-4 text-center ${styles.cardHover} ${styles.rainbowCard}`}
                        style={{ maxWidth: 1140, width: '100%', borderRadius: 36, background: '#ffffff', border: '3px solid #a7fff0', boxShadow: '0 20px 48px rgba(0,200,150,.18)' }}
                    >
                        {src ? (
                            <div style={{ position: 'relative', width: '100%', minHeight: 280, borderRadius: 26, overflow: 'hidden', background: '#f8fafc' }}>
                                <img
                                    className={styles.imageHover}
                                    src={src}
                                    alt={t.teachersTitle}
                                    loading="lazy"
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                    style={{ width: '100%', height: 'auto', maxHeight: '750px', objectFit: 'contain', display: 'block' }}
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
                                <span className="text-600 font-medium text-base">{lang === 'vi' ? 'Đang cập nhật hình ảnh tập thể...' : 'Loading faculty photograph...'}</span>
                            </div>
                        )}

                        <div className="p-3 mt-3">
                            <h3 className="m-0 text-xl md:text-2xl font-black text-900 mb-2">
                                {lang === 'vi' ? 'Tập Thể Cán Bộ & Giáo Viên Mầm Non Nắng Hồng' : 'Faculty & Educators of Nang Hong Kindergarten'}
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
    );
});

/* -------------------------------------------------------------------------- */
/*  Video (facade: chỉ nạp iframe YouTube khi người dùng bấm play)             */
/* -------------------------------------------------------------------------- */

const VideoPlayer = memo(function VideoPlayer({ video, posterSrc, playLabel }: { video: PromotionalVideo; posterSrc: string; playLabel: string }) {
    const [playing, setPlaying] = useState(false);

    const embedUrl = useMemo(() => {
        const base = getYoutubeEmbedUrl(video.video_url) || '';
        return base ? `${base}${base.includes('?') ? '&' : '?'}autoplay=1` : '';
    }, [video.video_url]);

    const handlePlay = () => {
        if (embedUrl) setPlaying(true);
        else window.open(video.video_url, '_blank');
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: 420, borderRadius: 20, overflow: 'hidden', background: '#000' }}>
            {playing ? (
                <iframe
                    src={embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
            ) : (
                <button
                    type="button"
                    onClick={handlePlay}
                    aria-label={playLabel}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, padding: 0, cursor: 'pointer', background: 'transparent' }}
                >
                    {posterSrc ? (
                        <Image src={posterSrc} alt="" fill unoptimized sizes="(max-width: 992px) 100vw, 58vw" referrerPolicy="no-referrer" style={{ objectFit: 'cover' }} />
                    ) : null}
                    <span
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 84,
                            height: 84,
                            borderRadius: '50%',
                            background: COLORS.pink,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 12px 30px rgba(0,0,0,.35)'
                        }}
                    >
                        <i className="pi pi-play text-3xl" />
                    </span>
                </button>
            )}
        </div>
    );
});

const VideoSection = memo(function VideoSection({ t, video, posterSrc }: { t: LandingText; video?: PromotionalVideo; posterSrc: string }) {
    return (
        <section
            id="video"
            className={`px-4 py-8 ${styles.videoSection} ${styles.sectionMotion}`}
            style={{ background: `linear-gradient(135deg,${COLORS.green},${COLORS.blue},${COLORS.purple})` }}
        >
            <SectionFloatingIcons icons={ICONS.video} />
            <div className={`grid align-items-center text-white ${styles.sectionContentMotion}`} style={sectionStyle}>
                <div className="col-12 lg:col-5">
                    <h2 className="m-0 mb-3" style={bigTitleStyle}>
                        {t.videoTitle}
                    </h2>
                    <p className="text-lg mb-4 font-normal" style={{ lineHeight: 1.75, opacity: 0.95 }}>
                        {t.videoDesc}
                    </p>

                    {video ? (
                        <Button
                            label={t.openVideo}
                            rounded
                            severity="warning"
                            icon="pi pi-play"
                            style={{ fontWeight: 800, padding: '12px 28px' }}
                            onClick={() => window.open(video.video_url, '_blank')}
                        />
                    ) : null}
                </div>

                <div className="col-12 lg:col-7">
                    <div
                        className={`card ${styles.videoCard}`}
                        style={{ borderRadius: 28, overflow: 'hidden', border: '4px solid rgba(255,255,255,0.85)', boxShadow: '0 20px 50px rgba(0,0,0,.25)' }}
                    >
                        {video ? <VideoPlayer key={video.video_url} video={video} posterSrc={posterSrc} playLabel={t.openVideo} /> : <p className="p-4 text-center">{t.noVideo}</p>}
                    </div>
                </div>
            </div>
        </section>
    );
});

/* -------------------------------------------------------------------------- */
/*  Apply form (state nằm trong component này để gõ phím không render lại cả trang) */
/* -------------------------------------------------------------------------- */

const INITIAL_FORM = {
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childAge: '',
    programId: '',
    message: ''
};

type ApplyForm = typeof INITIAL_FORM;

const Field = ({ id, label, col = 'md:col-6', children }: { id: string; label: string; col?: string; children: React.ReactNode }) => (
    <div className={`col-12 ${col}`}>
        <label htmlFor={id} className="block mb-2 font-bold text-800">
            {label}
        </label>
        {children}
    </div>
);

const ApplySection = memo(function ApplySection({ t, lang, programs, siteContent, showToast }: { t: LandingText; lang: Lang; programs: ProgramRow[]; siteContent: SiteContent | null; showToast: ShowToast }) {
    const [form, setForm] = useState<ApplyForm>(INITIAL_FORM);
    const [applying, setApplying] = useState(false);

    const bind = (field: keyof ApplyForm) => ({
        value: form[field],
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const value = event.target.value;
            setForm((prev) => ({ ...prev, [field]: value }));
        }
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (applying) return;

        const parentName = form.parentName.trim();
        const parentPhone = form.parentPhone.trim();
        const childName = form.childName.trim();

        if (!parentName || !parentPhone || !childName) {
            showToast('warn', t.applyMissingSummary, t.applyMissingDetail);
            return;
        }
        if (!form.programId) {
            showToast('warn', t.applyMissingProgramSummary, t.applyMissingProgramDetail);
            return;
        }

        try {
            setApplying(true);
            await createApplication({
                parent_name: parentName,
                parent_phone: parentPhone,
                parent_email: form.parentEmail.trim(),
                child_name: childName,
                child_age: Number(form.childAge) || undefined,
                program_id: Number(form.programId),
                message: form.message.trim()
            });

            showToast('success', t.applySuccessSummary, t.applySuccessDetail);
            setForm((prev) => ({ ...INITIAL_FORM, programId: prev.programId }));
        } catch {
            showToast('error', t.errorSummary, t.applyError);
        } finally {
            setApplying(false);
        }
    };

    return (
        <section id="apply" className={`px-4 py-8 ${styles.pinkSection} ${styles.colorfulSection} ${styles.sectionMotion}`}>
            <SectionFloatingIcons icons={ICONS.apply} />
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
                        <Badge color={COLORS.pink} candy={false}>
                            {t.applyBadge}
                        </Badge>

                        <h2 className="m-0 mb-3" style={bigTitleStyle}>
                            {t.applyTitle}
                        </h2>

                        <p className="text-700 text-lg mb-4 font-normal" style={{ lineHeight: 1.75 }}>
                            {t.applyDescPrefix} <span className="font-bold text-pink-500">{siteContent?.admission_period || t.openNow}</span>. {t.applyDescSuffix}
                        </p>

                        <div className="p-3 border-round-2xl surface-card inline-block text-sm text-700 font-medium">
                            📞 {lang === 'vi' ? 'Hotline hỗ trợ trực tiếp:' : 'Direct Hotline:'} <strong className="text-900">{siteContent?.phone_number || '012-345-6789'}</strong>
                        </div>
                    </div>

                    <div className="col-12 lg:col-7">
                        <form onSubmit={handleSubmit} className={`card p-4 md:p-5 ${styles.cardHover}`} style={{ borderRadius: 28, background: '#fff' }}>
                            <div className="grid">
                                <Field id="apply-parent-name" label={t.parentName}>
                                    <InputText id="apply-parent-name" className="w-full" autoComplete="name" placeholder={t.parentNamePlaceholder} {...bind('parentName')} />
                                </Field>

                                <Field id="apply-parent-phone" label={t.phone}>
                                    <InputText id="apply-parent-phone" className="w-full" type="tel" inputMode="tel" autoComplete="tel" placeholder={t.phonePlaceholder} {...bind('parentPhone')} />
                                </Field>

                                <Field id="apply-parent-email" label={t.email}>
                                    <InputText id="apply-parent-email" className="w-full" type="email" inputMode="email" autoComplete="email" placeholder={t.emailPlaceholder} {...bind('parentEmail')} />
                                </Field>

                                <Field id="apply-child-name" label={t.childName}>
                                    <InputText id="apply-child-name" className="w-full" placeholder={t.childNamePlaceholder} {...bind('childName')} />
                                </Field>

                                <Field id="apply-child-age" label={t.childAge}>
                                    <InputText
                                        id="apply-child-age"
                                        className="w-full"
                                        inputMode="numeric"
                                        maxLength={2}
                                        placeholder={t.childAgePlaceholder}
                                        value={form.childAge}
                                        onChange={(event) => {
                                            const digits = event.target.value.replace(/\D/g, '');
                                            setForm((prev) => ({ ...prev, childAge: digits }));
                                        }}
                                    />
                                </Field>

                                <Field id="apply-program" label={t.programRequired}>
                                    <select id="apply-program" className="w-full p-inputtext p-component font-medium" {...bind('programId')}>
                                        <option value="">{t.selectProgram}</option>
                                        {programs.map((program) => (
                                            <option key={program.id} value={program.id}>
                                                {program.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field id="apply-message" label={t.message} col="">
                                    <InputText id="apply-message" className="w-full" placeholder={t.messagePlaceholder} {...bind('message')} />
                                </Field>

                                <div className="col-12 mt-2">
                                    <Button
                                        type="submit"
                                        label={t.submitApplication}
                                        icon="pi pi-send"
                                        rounded
                                        loading={applying}
                                        style={{ ...buttonPink, width: '100%', padding: '14px 28px', fontSize: '1.05rem' }}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
});

/* -------------------------------------------------------------------------- */
/*  News                                                                      */
/* -------------------------------------------------------------------------- */

const NewsCard = memo(function NewsCard({ article, t, onRead }: { article: NewsArticle; t: LandingText; onRead: (id: NewsArticle['id']) => void }) {
    const excerpt = useMemo(() => (article.content ? `${article.content.replace(/\s+/g, ' ').slice(0, 130)}...` : t.noContent), [article.content, t.noContent]);

    return (
        <div className="col-12 md:col-4">
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
                        {excerpt}
                    </p>
                </div>

                <div className="pt-2 border-top-1 border-100 flex align-items-center justify-content-between">
                    <span className="text-xs text-500 font-medium">
                        {t.byAuthor} {article.author_name || 'Admin'}
                    </span>
                    <Button label={t.readMore} icon="pi pi-arrow-right" text style={{ color: COLORS.pink, fontWeight: 800, padding: 0 }} onClick={() => onRead(article.id)} />
                </div>
            </div>
        </div>
    );
});

const NewsSection = memo(function NewsSection({ t, articles, onRead }: { t: LandingText; articles: NewsArticle[]; onRead: (id: NewsArticle['id']) => void }) {
    return (
        <section id="news" className={`px-4 py-8 ${styles.newsSection} ${styles.sectionMotion}`} style={{ background: COLORS.lightPink }}>
            <SectionFloatingIcons icons={ICONS.news} />
            <div className={styles.sectionContentMotion} style={sectionStyle}>
                <SectionTitle badge={t.newsBadge} title={t.newsTitle} desc={t.newsDesc} />

                <div className="grid">
                    {articles.map((article) => (
                        <NewsCard key={article.id} article={article} t={t} onRead={onRead} />
                    ))}
                </div>
            </div>
        </section>
    );
});

/* -------------------------------------------------------------------------- */
/*  Newsletter                                                                */
/* -------------------------------------------------------------------------- */

const NewsletterSection = memo(function NewsletterSection({ t, showToast }: { t: LandingText; showToast: ShowToast }) {
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = email.trim();
        if (!value || subscribing) return;

        try {
            setSubscribing(true);
            await createNewsletterSubscriber({ email: value });
            setEmail('');
            showToast('success', t.subscribeSuccessSummary, t.subscribeSuccessDetail);
        } catch {
            showToast('error', t.errorSummary, t.subscribeError);
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <section className={`px-4 py-8 ${styles.softSection} ${styles.sectionMotion}`}>
            <SectionFloatingIcons icons={ICONS.newsletter} />
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
                        <form onSubmit={handleSubmit} className="flex flex-column sm:flex-row gap-2">
                            <InputText
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                aria-label={t.newsletterPlaceholder}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder={t.newsletterPlaceholder}
                                className="w-full"
                                style={{ padding: '14px 20px', borderRadius: 24 }}
                            />
                            <Button type="submit" label={t.subscribe} rounded severity="warning" loading={subscribing} style={{ fontWeight: 800, padding: '14px 28px', whiteSpace: 'nowrap' }} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
});

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

const Footer = memo(function Footer({ t, siteContent, onNavigate }: { t: LandingText; siteContent: SiteContent | null; onNavigate: (id: string) => void }) {
    const phone = siteContent?.phone_number;

    return (
        <footer id="contact" className={`px-4 py-7 bg-white ${styles.footerGlow} ${styles.sectionMotion}`}>
            <SectionFloatingIcons icons={ICONS.footer} />
            <div className={`grid ${styles.sectionContentMotion}`} style={sectionStyle}>
                <div className="col-12 md:col-4 pr-md-4">
                    <div className="flex align-items-center gap-2 mb-3">
                        <div className="border-circle flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: COLORS.pink, color: '#fff' }}>
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
                        {FOOTER_LINKS.map((item) => (
                            <span key={item.id} className="cursor-pointer hover:text-pink-500 transition-colors" onClick={() => onNavigate(item.id)}>
                                {t[item.key]}
                            </span>
                        ))}
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
                            <a href={`tel:${phone || '0123456789'}`} className="text-700 no-underline font-semibold hover:underline">
                                {phone || '012-345-6789'}
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
    );
});

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function NangHongLandingPage() {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [lang, setLang] = useState<Lang>('vi');
    const t = landingText[lang];

    // Luôn trỏ tới bản dịch mới nhất để toast lỗi không bị kẹt ở ngôn ngữ lúc mount
    const tRef = useRef(t);
    tRef.current = t;

    const showToast = useCallback<ShowToast>((severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    }, []);

    const handleLoadError = useCallback(() => showToast('error', 'Error', tRef.current.loadError), [showToast]);
    const { programs, articles, videos, siteContent } = useLandingData(handleLoadError);

    const programItems = useMemo(() => getProgramChildren(programs), [programs]);
    const latestNews = useMemo(() => articles.slice(0, 3), [articles]);
    const latestVideo = videos[0];
    const heroThumb = latestVideo?.thumbnail_image_url;
    const heroSrc = useMemo(() => (heroThumb ? normalizeDriveThumbnailUrl(heroThumb) : ''), [heroThumb]);
    const heroAlt = latestVideo?.title || t.brandName;

    // Ảnh tập thể giáo viên: lấy ảnh đầu tiên admin đã tải lên, không có thì để trống
    const teacherGroupImageUrl = useMemo(() => getTeachers(programs).find((tc) => tc.profile_image_url)?.profile_image_url as string | undefined, [programs]);

    const scrollTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const scrollToApply = useCallback(() => scrollTo('apply'), [scrollTo]);
    const toggleLang = useCallback(() => setLang((current) => (current === 'vi' ? 'en' : 'vi')), []);
    const goToProgram = useCallback((id: string | number) => router.push(`/landing/programs/${id}`), [router]);
    const goToNews = useCallback((id: NewsArticle['id']) => router.push(`/landing/news/${id}`), [router]);

    return (
        <div className={styles.landingRoot} style={rootStyle}>
            <Toast ref={toast} />

            <Header t={t} lang={lang} onToggleLang={toggleLang} onNavigate={scrollTo} />

            <main id="home" style={{ paddingTop: HEADER_HEIGHT }}>
                <HeroSection t={t} heroSrc={heroSrc} heroAlt={heroAlt} onNavigate={scrollTo} />

                <HighlightsSection lang={lang} />

                <ProgramsSection t={t} items={programItems} onView={goToProgram} />

                <AboutSection t={t} lang={lang} siteContent={siteContent} imageSrc={heroSrc} imageAlt={heroAlt} />

                <TeachersSection t={t} lang={lang} imageUrl={teacherGroupImageUrl} />

                <FacilitiesSection lang={lang} getImageUrl={getImageUrl} />

                <NutritionSection lang={lang} />

                <TuitionSection lang={lang} onApplyClick={scrollToApply} />

                <VideoSection t={t} video={latestVideo} posterSrc={heroSrc} />

                <ApplySection t={t} lang={lang} programs={programs} siteContent={siteContent} showToast={showToast} />

                <NewsSection t={t} articles={latestNews} onRead={goToNews} />

                <NewsletterSection t={t} showToast={showToast} />

                <GoogleMapEmbed lang={lang} siteContent={siteContent} />
            </main>

            <Footer t={t} siteContent={siteContent} onNavigate={scrollTo} />
        </div>
    );
}
