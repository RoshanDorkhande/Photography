import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';

const ServiceGallery = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const columnsRef = useRef([]);
    const { galleryImages } = useData();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isAnimating, setIsAnimating] = useState(true);

    // Filter images for this service
    const images = galleryImages.filter(img => img.serviceId === id);

    // Group into 5 columns
    const columns = [[], [], [], [], []];
    images.forEach((img, i) => {
        columns[i % 5].push(img);
    });

    // Specific offsets for that "organic" look
    const offsets = [0, 120, 60, 180, 40];

    // GSAP animations with dynamic import
    useEffect(() => {
        let ctx;
        (async () => {
            const gsap = (await import('gsap')).default;

            ctx = gsap.context(() => {
                const container = containerRef.current;
                const cols = columnsRef.current;

                // Slide-in animation for the entire gallery
                gsap.fromTo(container,
                    { x: '100%' },
                    {
                        x: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        onComplete: () => setIsAnimating(false)
                    }
                );

                // Column stagger animation
                gsap.set(cols, { y: '150vh' });
                const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 2 }, delay: 0.5 });
                tl.to(cols[2], { y: 0 })
                    .to([cols[1], cols[3]], { y: 0 }, '-=1.8')
                    .to([cols[0], cols[4]], { y: 0 }, '-=1.8');
            });
        })();

        return () => ctx?.revert();
    }, []);

    // Exit animation
    const handleClose = async () => {
        const gsap = (await import('gsap')).default;
        gsap.to(containerRef.current, {
            x: '100%',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => navigate('/')
        });
    };

    // Navigation Handlers
    const showNext = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % images.length);
    };

    const showPrev = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    // Swipe Handlers
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            showNext();
        }
        if (isRightSwipe) {
            showPrev();
        }
    };

    return (
        <div
            className="service-gallery"
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 200,
                overflowY: 'auto',
                transform: 'translateX(100%)' // Initial state for GSAP
            }}
        >
            <div className="gallery-header">
                <div className="gallery-title">{id.replace('-', ' ')}</div>
                <button className="close-btn hover-trigger" onClick={handleClose}>
                    &times;
                </button>
            </div>

            <div className="gallery-grid">
                {columns.map((col, colIndex) => (
                    <div
                        key={colIndex}
                        className="gallery-col"
                        ref={el => columnsRef.current[colIndex] = el}
                        style={{ marginTop: `${offsets[colIndex]}px` }}
                    >
                        {col.map((img) => (
                            <div
                                key={img.id}
                                className="gallery-item"
                                onClick={() => {
                                    const index = images.findIndex(i => i.id === img.id);
                                    setSelectedIndex(index);
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={getOptimizedImageUrl(img.src, 'thumbnail')}
                                    alt={`Gallery ${img.id}`}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Lightbox Overlay */}
            {selectedIndex !== null && (
                <div
                    className="lightbox-overlay open"
                    onClick={closeLightbox}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <button className="lightbox-nav lightbox-prev" onClick={showPrev}>&#10094;</button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
                        <img
                            src={getOptimizedImageUrl(images[selectedIndex].src, 'lightbox')}
                            alt="Full view"
                            className="lightbox-img"
                        />
                        {images[selectedIndex].caption && <p className="lightbox-caption">{images[selectedIndex].caption}</p>}
                    </div>

                    <button className="lightbox-nav lightbox-next" onClick={showNext}>&#10095;</button>
                </div>
            )}
        </div>
    );
};

export default ServiceGallery;
