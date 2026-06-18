'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Carousel } from 'primereact/carousel';

import { getPrograms } from '../../../demo/service/ProgramService';
import { getNewsArticles, type NewsArticle } from '../../../demo/service/NewsArticleService';
import {
    getPromotionalVideos,
    normalizeDriveThumbnailUrl,
    normalizeDriveVideoUrl,
    type PromotionalVideo
} from '../../../demo/service/PromotionalVideoService';
import { createNewsletterSubscriber } from '../../../demo/service/NewsletterService';
import { getSiteContents, type SiteContent } from '../../../demo/service/SiteContentService';

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
    pink: '#ff5fa2',
    yellow: '#ffc83d',
    green: '#19c79f',
    blue: '#6ecbff',
    purple: '#b78cff',
    cream: '#fffaf0',
    lightPink: '#fff0f7',
    lightYellow: '#fff8d6',
    lightGreen: '#e9fff8'
};

const sectionStyle: React.CSSProperties = {
    maxWidth: '1180px',
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
    fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
    fontWeight: 900,
    lineHeight: 1.05
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
    <div className="text-center mb-5">
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
        style={{
            position: 'absolute',
            borderRadius: '999px',
            opacity: 0.55,
            zIndex: 0,
            ...style
        }}
    />
);

export default function NangHongLandingPage() {
    const toast = useRef<Toast>(null);

    const [programs, setPrograms] = useState<ProgramRow[]>([]);
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [videos, setVideos] = useState<PromotionalVideo[]>([]);
    const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);

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
                detail: 'Không tải được dữ liệu trang chủ',
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
                      title: 'Lớp học vui',
                      detail: 'Các hoạt động học tập nhẹ nhàng, giúp bé làm quen với môi trường lớp học.',
                      thumbnail_url: ''
                  },
                  {
                      id: 'p2',
                      title: 'Lớp vận động',
                      detail: 'Các trò chơi vận động giúp bé khỏe mạnh, nhanh nhẹn và tự tin hơn.',
                      thumbnail_url: ''
                  },
                  {
                      id: 'p3',
                      title: 'Lớp sáng tạo',
                      detail: 'Hoạt động vẽ, âm nhạc và thủ công giúp bé phát triển trí tưởng tượng.',
                      thumbnail_url: ''
                  }
              ];

    const displayTeachers =
        teachers.length > 0
            ? teachers
            : [
                  { id: 't1', full_name: 'Cô Nắng Hồng', role: 'Giáo viên mầm non', profile_image_url: '' },
                  { id: 't2', full_name: 'Cô Hoa Mai', role: 'Giáo viên năng khiếu', profile_image_url: '' },
                  { id: 't3', full_name: 'Cô Ánh Dương', role: 'Giáo viên chăm sóc trẻ', profile_image_url: '' },
                  { id: 't4', full_name: 'Cô Bích Ngọc', role: 'Giáo viên lớp mẫu giáo', profile_image_url: '' }
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
                summary: 'Đăng ký thành công',
                detail: 'Cảm ơn bạn đã theo dõi Mầm Non Nắng Hồng',
                life: 3000
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể đăng ký newsletter',
                life: 3000
            });
        } finally {
            setSubscribing(false);
        }
    };

    const programTemplate = (item: any) => (
        <div className="p-3">
            <div
                className="card text-center h-full"
                style={{
                    borderRadius: 32,
                    minHeight: 350,
                    background: 'linear-gradient(180deg,#ffffff 0%,#fff7fb 100%)',
                    border: '3px solid #ffe0ef',
                    boxShadow: '0 16px 35px rgba(255,95,162,.18)'
                }}
            >
                {item.thumbnail_url ? (
                    <img
                        src={item.thumbnail_url}
                        alt={item.title || 'Chương trình học'}
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

                <h3 className="text-2xl mb-2">{item.title || 'Chương trình học'}</h3>

                <p className="text-600 line-height-3">
                    {item.detail || 'Hoạt động học tập vui nhộn và phù hợp với trẻ mầm non.'}
                </p>

                <Button label="Xem chi tiết" rounded text style={{ color: COLORS.pink, fontWeight: 700 }} />
            </div>
        </div>
    );

    const teacherTemplate = (teacher: any) => (
        <div className="p-3">
            <div
                className="card text-center h-full"
                style={{
                    borderRadius: 32,
                    minHeight: 350,
                    background: 'linear-gradient(180deg,#ffffff 0%,#fff0f7 100%)',
                    border: '3px solid #ffd6e8',
                    boxShadow: '0 16px 35px rgba(25,199,159,.16)'
                }}
            >
                {teacher.profile_image_url ? (
                    <img
                        src={teacher.profile_image_url}
                        alt={teacher.full_name || 'Giáo viên'}
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

                <h3 className="mb-1 text-2xl">{teacher.full_name || 'Giáo viên'}</h3>
                <p className="text-600 m-0">{teacher.role || 'Giáo viên mầm non'}</p>
            </div>
        </div>
    );

    return (
        <div style={{ background: COLORS.cream, color: '#263238', overflow: 'hidden' }}>
            <Toast ref={toast} />

            <header
                className="fixed top-0 left-0 right-0 z-5"
                style={{
                    background: 'rgba(255,255,255,.94)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #ffe0ed'
                }}
            >
                <div className="flex align-items-center justify-content-between px-4 py-3" style={sectionStyle}>
                    <div className="flex align-items-center gap-2">
                        <div
                            className="border-circle flex align-items-center justify-content-center"
                            style={{
                                width: 46,
                                height: 46,
                                background: `linear-gradient(135deg,${COLORS.yellow},${COLORS.pink})`,
                                color: '#fff'
                            }}
                        >
                            <i className="pi pi-sun text-xl" />
                        </div>

                        <div>
                            <div className="font-bold text-2xl">Mầm Non Nắng Hồng</div>
                            <div className="text-sm font-semibold" style={{ color: COLORS.green }}>
                                Nơi bé học vui mỗi ngày
                            </div>
                        </div>
                    </div>

                    <nav className="hidden md:flex gap-4 align-items-center font-semibold">
                        <button className="p-link" onClick={() => scrollTo('home')}>Trang chủ</button>
                        <button className="p-link" onClick={() => scrollTo('about')}>Giới thiệu</button>
                        <button className="p-link" onClick={() => scrollTo('programs')}>Chương trình</button>
                        <button className="p-link" onClick={() => scrollTo('news')}>Tin tức</button>
                        <button className="p-link" onClick={() => scrollTo('contact')}>Liên hệ</button>
                    </nav>

                    <Button label="Đăng ký ngay" rounded style={buttonPink} onClick={() => scrollTo('apply')} />
                </div>
            </header>

            <main id="home" style={{ paddingTop: 84 }}>
                <section
                    className="px-4 py-8 relative"
                    style={{
                        background: `linear-gradient(135deg, ${COLORS.lightPink} 0%, ${COLORS.lightYellow} 48%, ${COLORS.lightGreen} 100%)`
                    }}
                >
                    <DecorativeBubble style={{ width: 260, height: 260, background: COLORS.pink, top: -90, right: -80 }} />
                    <DecorativeBubble style={{ width: 160, height: 160, background: COLORS.blue, bottom: 30, left: -50 }} />
                    <DecorativeBubble style={{ width: 90, height: 90, background: COLORS.yellow, top: 140, left: '48%' }} />

                    <div className="grid align-items-center relative z-1" style={sectionStyle}>
                        <div className="col-12 lg:col-6">
                            <div
                                className="inline-block px-4 py-2 border-round-3xl font-bold mb-3"
                                style={{ background: '#fff', color: COLORS.pink, boxShadow: '0 8px 18px rgba(255,95,162,.18)' }}
                            >
                                🌞 Trường Mầm Non Nắng Hồng
                            </div>

                            <h1 className="m-0 mb-4" style={titleStyle}>
                                Mỗi ngày đến trường là một ngày vui
                            </h1>

                            <p className="text-xl line-height-3 text-700 mb-5">
                                Môi trường học tập ấm áp, an toàn, nhiều màu sắc và tràn đầy yêu thương cho các bé.
                            </p>

                            <div className="flex gap-3 flex-wrap">
                                <Button label="Tuyển sinh" rounded icon="pi pi-send" style={buttonYellow} onClick={() => scrollTo('apply')} />
                                <Button
                                    label="Xem chương trình"
                                    rounded
                                    outlined
                                    icon="pi pi-arrow-right"
                                    style={{ color: COLORS.pink, borderColor: COLORS.pink, fontWeight: 700 }}
                                    onClick={() => scrollTo('programs')}
                                />
                            </div>
                        </div>

                        <div className="col-12 lg:col-6">
                            <div
                                className="relative overflow-hidden"
                                style={{
                                    borderRadius: '45% 55% 48% 52%',
                                    border: '12px solid #ffffff',
                                    boxShadow: '0 24px 60px rgba(255,95,162,.25)'
                                }}
                            >
                                <img
                                    src={latestVideo ? normalizeDriveThumbnailUrl(latestVideo.thumbnail_image_url) : '/layout/images/landing/landing-hero-image.jpg'}
                                    alt="Mầm Non Nắng Hồng"
                                    style={{ width: '100%', height: 450, objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="programs" className="px-4 py-8 bg-white">
                    <div style={sectionStyle}>
                        <SectionTitle
                            badge="Our Programs"
                            title="Chương trình học vui nhộn"
                            desc="Các hoạt động học tập, vui chơi, vận động và sáng tạo dành cho trẻ mầm non."
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

                <section id="about" className="px-4 py-8 relative" style={{ background: COLORS.lightGreen }}>
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
                                    src="/layout/images/landing/landing-hero-image.jpg"
                                    alt="Giới thiệu Mầm Non Nắng Hồng"
                                    style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                        </div>

                        <div className="col-12 lg:col-6">
                            <h2 className="m-0 mb-3" style={{ ...titleStyle, fontSize: 'clamp(2.2rem, 4vw, 4.2rem)' }}>
                                Mỗi bé đều là một mặt trời nhỏ cần được yêu thương.
                            </h2>

                            <p className="text-700 text-lg line-height-3">
                                {siteContent?.about_section_quote || 'Đội ngũ giáo viên tận tâm đồng hành cùng bé trong từng bước phát triển.'}
                            </p>

                            <div className="grid mt-4">
                                {[
                                    { value: siteContent?.stat_years_experience || '14+', label: 'Năm kinh nghiệm', color: COLORS.green },
                                    { value: siteContent?.stat_students_info || '500+', label: 'Học sinh mỗi năm', color: COLORS.yellow },
                                    { value: siteContent?.stat_awards_info || '20+', label: 'Thành tích', color: COLORS.pink }
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

                <section className="px-4 py-8 bg-white">
                    <div style={sectionStyle}>
                        <SectionTitle
                            badge="Teachers"
                            title="Đội ngũ giáo viên"
                            desc="Các cô giáo yêu trẻ, tận tâm và luôn tạo cảm giác an toàn cho bé."
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

                <section id="video" className="px-4 py-8" style={{ background: `linear-gradient(135deg,${COLORS.green},${COLORS.blue})` }}>
                    <div className="grid align-items-center text-white" style={sectionStyle}>
                        <div className="col-12 lg:col-5">
                            <h2 className="m-0 mb-3" style={{ ...titleStyle, fontSize: 'clamp(2.2rem, 4vw, 4rem)' }}>Video giới thiệu</h2>
                            <p className="text-lg line-height-3">Cùng nhìn lại môi trường học tập vui tươi tại Mầm Non Nắng Hồng.</p>

                            {latestVideo ? (
                                <Button
                                    label="Mở video"
                                    rounded
                                    severity="warning"
                                    icon="pi pi-play"
                                    onClick={() => window.open(normalizeDriveVideoUrl(latestVideo.video_url), '_blank')}
                                />
                            ) : null}
                        </div>

                        <div className="col-12 lg:col-7">
                            <div className="card" style={{ borderRadius: 28 }}>
                                {latestVideo ? (
                                    <video
                                        src={normalizeDriveVideoUrl(latestVideo.video_url)}
                                        poster={normalizeDriveThumbnailUrl(latestVideo.thumbnail_image_url)}
                                        controls
                                        style={{ width: '100%', maxHeight: 420, borderRadius: 20, background: '#000' }}
                                    />
                                ) : (
                                    <p>Chưa có video giới thiệu.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="apply" className="px-4 py-8 bg-white">
                    <div
                        className="text-center p-6"
                        style={{
                            ...sectionStyle,
                            borderRadius: 36,
                            background: `linear-gradient(135deg,${COLORS.lightYellow},${COLORS.lightPink})`,
                            border: '3px dashed #ffc1dc'
                        }}
                    >
                        <h2 className="m-0 mb-3" style={{ ...titleStyle, fontSize: 'clamp(2.2rem, 4vw, 4rem)' }}>Tuyển sinh năm học mới</h2>

                        <p className="text-700 text-lg line-height-3">
                            Thời gian tuyển sinh: {siteContent?.admission_period || 'Đang mở'}.
                            Phụ huynh có thể liên hệ nhà trường để được tư vấn chi tiết.
                        </p>

                        <Button label="Liên hệ tư vấn" rounded icon="pi pi-phone" style={buttonPink} onClick={() => scrollTo('contact')} />
                    </div>
                </section>

                <section id="news" className="px-4 py-8" style={{ background: COLORS.lightPink }}>
                    <div style={sectionStyle}>
                        <SectionTitle
                            badge="News"
                            title="Tin tức Nắng Hồng"
                            desc="Những hoạt động và thông báo mới nhất của nhà trường."
                        />

                        <div className="grid">
                            {latestNews.map((article) => (
                                <div key={article.id} className="col-12 md:col-4">
                                    <div
                                        className="card h-full"
                                        style={{
                                            borderRadius: 28,
                                            border: '3px solid #ffd6e8',
                                            boxShadow: '0 12px 28px rgba(255,95,162,.13)'
                                        }}
                                    >
                                        {article.thumbnail_url ? (
                                            <img
                                                src={article.thumbnail_url}
                                                alt={article.title}
                                                style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 22 }}
                                            />
                                        ) : null}

                                        <h3 className="text-2xl">{article.title}</h3>

                                        <p className="text-600 line-height-3">
                                            {article.content ? `${article.content.replace(/\s+/g, ' ').slice(0, 120)}...` : 'Chưa có nội dung.'}
                                        </p>

                                        <div className="text-sm text-500">
                                            bởi {article.author_name || 'Admin'} · {article.Comments?.length || 0} bình luận
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-4 py-8">
                    <div
                        className="p-5 text-white"
                        style={{
                            ...sectionStyle,
                            borderRadius: 36,
                            background: `linear-gradient(135deg,${COLORS.pink},${COLORS.yellow},${COLORS.green})`,
                            boxShadow: '0 18px 45px rgba(255,95,162,.22)'
                        }}
                    >
                        <div className="grid align-items-center">
                            <div className="col-12 lg:col-6">
                                <h2 className="text-4xl font-bold mt-0">Đăng ký nhận tin</h2>
                                <p className="text-lg">Nhận thông tin mới nhất về tuyển sinh và hoạt động của trường.</p>
                            </div>

                            <div className="col-12 lg:col-6">
                                <div className="flex flex-column sm:flex-row gap-2">
                                    <InputText
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="Email của phụ huynh"
                                        className="w-full"
                                    />

                                    <Button label="Đăng ký" rounded severity="warning" loading={subscribing} onClick={handleSubscribe} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer id="contact" className="px-4 py-6 bg-white">
                <div className="grid" style={sectionStyle}>
                    <div className="col-12 md:col-4">
                        <h2>Mầm Non Nắng Hồng</h2>
                        <p className="text-600 line-height-3">
                            {siteContent?.footer_description || 'Nơi bé được yêu thương, vui chơi và phát triển mỗi ngày.'}
                        </p>
                    </div>

                    <div className="col-12 md:col-4">
                        <h3>Liên kết nhanh</h3>
                        <p>Giới thiệu</p>
                        <p>Chương trình</p>
                        <p>Tin tức</p>
                        <p>Liên hệ</p>
                    </div>

                    <div className="col-12 md:col-4">
                        <h3>Liên hệ</h3>
                        <p>{siteContent?.address || 'Thành phố Hồ Chí Minh'}</p>
                        <p>{siteContent?.phone_number || '012-345-6789'}</p>
                        <p>{siteContent?.support_email || 'support@nanghong.edu.vn'}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}