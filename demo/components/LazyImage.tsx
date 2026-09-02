'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    sizes?: string;
    priority?: boolean;
    onLoad?: () => void;
    onError?: () => void;
    referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export default function LazyImage({
    src,
    alt,
    className,
    style,
    sizes = '(max-width: 768px) 100vw, 33vw',
    priority = false,
    onLoad,
    onError
}: LazyImageProps) {
    const [isVisible, setIsVisible] = useState(priority);
    const [loaded, setLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (priority) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '250px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: '#f6f7f9'
            }}
        >
            {isVisible && (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    unoptimized
                    priority={priority}
                    sizes={sizes}
                    className={className}
                    style={{
                        objectFit: 'cover',
                        transition: 'opacity 0.35s ease-in-out',
                        opacity: loaded ? 1 : 0,
                        ...style
                    }}
                    onLoad={() => {
                        setLoaded(true);
                        onLoad?.();
                    }}
                    onError={() => {
                        onError?.();
                    }}
                />
            )}
        </div>
    );
}