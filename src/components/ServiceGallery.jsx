import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';

// Constants moved outside component - never recreated
const COLUMN_OFFSETS = [0, 120, 60, 180, 40];
const MIN_SWIPE_DISTANCE = 50;

// Static styles moved outside component
const OVERLAY_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const CLOSE_BUTTON_STYLE = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1010,
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '2.5rem',
    cursor: 'pointer'
};

const LIGHTBOX_IMG_STYLE = {
    position: 'fixed',
    zIndex: 1005,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
};

const GALLERY_CONTAINER_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 200,
    overflowY: 'auto',
    transform: 'translateX(100%)' // Initial state for GSAP
};

const GALLERY_ITEM_STYLE = { cursor: 'pointer' };

// Cache GSAP module reference
let gsapModule = null;
const getGsap = async () => {
    if (!gsapModule) {
        gsapModule = (await import('gsap')).default;
    }
    return gsapModule;
};

const ServiceGallery = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const columnsRef = useRef([]);
    const thumbnailRefs = useRef({});
    const lightboxImgRef = useRef(null);
    const { galleryImages } = useData();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [storedRect, setStoredRect] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Memoize filtered images - only recalculate when dependencies change
    const images = useMemo(() =>
        galleryImages.filter(img => img.serviceId === id),
        [galleryImages, id]
    );

    // Memoize column distribution - only recalculate when images change
    const columns = useMemo(() => {
        const cols = [[], [], [], [], []];
        images.forEach((img, i) => {
            cols[i % 5].push(img);
        });
        return cols;
    }, [images]);

    // GSAP animations with dynamic import
    useEffect(() => {
        let ctx;
        (async () => {
            const gsap = await getGsap();

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

    // Body scroll lock - mandatory for iOS and proper rect calculation
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isLightboxOpen]);

    // Exit animation
    const handleClose = useCallback(async () => {
        const gsap = await getGsap();
        gsap.to(containerRef.current, {
            x: '100%',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => navigate('/')
        });
    }, [navigate]);

    // Open lightbox - animate ONLY the image with position: fixed
    const openLightbox = useCallback(async (imgId, thumbnailElement) => {
        const index = images.findIndex(i => i.id === imgId);
        if (index === -1) return;

        // Capture thumbnail rect relative to viewport
        const rect = thumbnailElement.getBoundingClientRect();
        setStoredRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        });

        setSelectedIndex(index);
        setIsLightboxOpen(true);

        // Wait for render, then animate image from thumbnail to center
        const gsap = await getGsap();

        // Need to wait for the lightbox img to be in DOM
        requestAnimationFrame(() => {
            const img = lightboxImgRef.current;
            if (!img) return;

            // Calculate target size maintaining aspect ratio
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const maxWidth = Math.min(viewportWidth * 0.9, 1200);
            const maxHeight = viewportHeight * 0.85;

            // Set initial position (at thumbnail)
            gsap.set(img, {
                position: 'fixed',
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                xPercent: 0,
                yPercent: 0,
                zIndex: 1005,
                objectFit: 'cover',
                borderRadius: 8
            });

            // Animate to center
            gsap.to(img, {
                top: '50%',
                left: '50%',
                xPercent: -50,
                yPercent: -50,
                width: maxWidth,
                height: 'auto',
                maxHeight: maxHeight,
                objectFit: 'contain',
                borderRadius: 4,
                duration: 0.4,
                ease: 'power3.out'
            });
        });
    }, [images]);

    // Close lightbox - animate image back to thumbnail, then unmount
    const closeLightbox = useCallback(async () => {
        if (!storedRect || !lightboxImgRef.current) {
            setIsLightboxOpen(false);
            setSelectedIndex(null);
            return;
        }

        const gsap = await getGsap();
        const img = lightboxImgRef.current;

        // Animate back to thumbnail position
        gsap.to(img, {
            top: storedRect.top,
            left: storedRect.left,
            width: storedRect.width,
            height: storedRect.height,
            xPercent: 0,
            yPercent: 0,
            objectFit: 'cover',
            borderRadius: 8,
            duration: 0.35,
            ease: 'power3.inOut',
            onComplete: () => {
                setIsLightboxOpen(false);
                setSelectedIndex(null);
                setStoredRect(null);
            }
        });
    }, [storedRect]);

    // Navigation Handlers - NO flip animation, just swap src
    const showNext = useCallback((e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const showPrev = useCallback((e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

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
    }, [selectedIndex, showNext, showPrev, closeLightbox]);

    // Memoized touch handlers
    const onTouchStart = useCallback((e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }, []);

    const onTouchMove = useCallback((e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
        const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;
        if (isLeftSwipe) {
            showNext();
        }
        if (isRightSwipe) {
            showPrev();
        }
    }, [touchStart, touchEnd, showNext, showPrev]);

    // Memoize gallery item click handler factory to avoid creating new functions
    const handleItemClick = useCallback((imgId) => (e) => {
        openLightbox(imgId, e.currentTarget);
    }, [openLightbox]);

    // Memoize column offset style factory
    const getColumnStyle = useCallback((colIndex) => ({
        marginTop: `${COLUMN_OFFSETS[colIndex]}px`
    }), []);

    return (
        <>
            <div
                className="service-gallery"
                ref={containerRef}
                style={GALLERY_CONTAINER_STYLE}
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
                            style={getColumnStyle(colIndex)}
                        >
                            {col.map((img) => (
                                <div
                                    key={img.id}
                                    className="gallery-item"
                                    ref={el => thumbnailRefs.current[img.id] = el}
                                    onClick={handleItemClick(img.id)}
                                    style={GALLERY_ITEM_STYLE}
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
            </div>

            {/* Lightbox rendered via Portal to document.body - escapes transformed parent */}
            {isLightboxOpen && selectedIndex !== null && createPortal(
                <div
                    className="lightbox-overlay open"
                    onClick={closeLightbox}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    style={OVERLAY_STYLE}
                >
                    <button className="lightbox-nav lightbox-prev" onClick={showPrev}>&#10094;</button>

                    <button
                        className="lightbox-close"
                        onClick={closeLightbox}
                        style={CLOSE_BUTTON_STYLE}
                    >
                        &times;
                    </button>

                    <img
                        ref={lightboxImgRef}
                        src={getOptimizedImageUrl(images[selectedIndex].src, 'lightbox')}
                        alt="Full view"
                        className="lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                        style={LIGHTBOX_IMG_STYLE}
                    />

                    <button className="lightbox-nav lightbox-next" onClick={showNext}>&#10095;</button>
                </div>,
                document.body
            )}
        </>
    );
};

export default ServiceGallery;
