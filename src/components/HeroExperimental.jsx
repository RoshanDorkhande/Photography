import React, { useEffect, useRef, useState, useMemo } from 'react';
import { HERO_IMAGES, ANIMATION_TIMING, MESSY_ROTATIONS } from '../constants/heroConstants';
import './HeroExperimental.css';

// Preloader timing: 2400ms animation + 800ms slide-up transition
const PRELOADER_DELAY = 3200;

// Cache GSAP module reference for performance
let gsapModule = null;
const getGsap = async () => {
    if (!gsapModule) {
        gsapModule = (await import('gsap')).default;
    }
    return gsapModule;
};

// Detect low-power devices
const isLowPowerDevice = () => {
    // Check for low core count (typical of budget phones)
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    // Check for memory constraints (if available)
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
    // Check for slow connection
    const slowConnection = navigator.connection &&
        (navigator.connection.effectiveType === '2g' || navigator.connection.saveData);

    return lowCores || lowMemory || slowConnection;
};

const HeroExperimental = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLowPower, setIsLowPower] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [preloaderDone, setPreloaderDone] = useState(false);
    const cardRefs = useRef([]);
    const containerRef = useRef(null);
    const animationComplete = useRef(false);

    // Detect low-power device on mount
    useEffect(() => {
        setIsLowPower(isLowPowerDevice());
    }, []);

    // Wait for preloader to complete before starting animations
    useEffect(() => {
        const timer = setTimeout(() => {
            setPreloaderDone(true);
        }, PRELOADER_DELAY);
        return () => clearTimeout(timer);
    }, []);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Select images based on screen size - balanced selection on mobile
    const displayImages = useMemo(() => {
        if (isMobile) {
            // Show 3 images on mobile: positions 1, 3, 5 (0-indexed)
            return [HERO_IMAGES[1], HERO_IMAGES[3], HERO_IMAGES[5]];
        }
        return HERO_IMAGES;
    }, [isMobile]);

    // Calculate scaled values for mobile
    const getScaledValues = (img, index) => {
        const mobileXScale = 0.22;
        const mobileYScale = 0.3;
        const mobileRotScale = 0.4;

        return {
            targetX: isMobile ? img.xOffset * mobileXScale : img.xOffset,
            targetY: isMobile ? img.yOffset * mobileYScale : img.yOffset,
            targetRot: isMobile
                ? img.rotation * mobileRotScale
                : (prefersReducedMotion ? 0 : img.rotation),
            initialRot: MESSY_ROTATIONS[index % MESSY_ROTATIONS.length],
        };
    };

    // GSAP Animation - starts after preloader completes
    useEffect(() => {
        if (!preloaderDone || animationComplete.current) return;

        let ctx;
        const runAnimation = async () => {
            const gsap = await getGsap();

            ctx = gsap.context(() => {
                const cards = cardRefs.current.filter(Boolean);
                if (cards.length === 0) return;

                const { initialDelay, riseDuration, pauseDuration, spreadDuration } = ANIMATION_TIMING;

                // Set initial state with force3D for GPU acceleration
                cards.forEach((card, index) => {
                    const { initialRot } = getScaledValues(displayImages[index], index);
                    gsap.set(card, {
                        y: 800,
                        x: 0,
                        opacity: 0,
                        scale: 0.8,
                        rotation: initialRot,
                        force3D: true, // Force GPU layer
                    });
                });

                // Use simplified animation for low-power devices or reduced motion
                const useSimpleAnimation = prefersReducedMotion || isLowPower;

                // Animate each card with staggered delay
                cards.forEach((card, index) => {
                    const { targetX, targetY, targetRot, initialRot } = getScaledValues(displayImages[index], index);
                    const staggerDelay = initialDelay + (index * (useSimpleAnimation ? 0.02 : 0.05));

                    if (useSimpleAnimation) {
                        // Simple fade-in + position for low-power/reduced motion
                        gsap.to(card, {
                            y: targetY,
                            x: targetX,
                            opacity: 1,
                            scale: 1,
                            rotation: isLowPower ? targetRot : 0,
                            duration: isLowPower ? 0.5 : 0.01,
                            delay: staggerDelay,
                            ease: 'power2.out',
                            force3D: true,
                            onComplete: () => {
                                // Clean up will-change after animation
                                if (card) card.style.willChange = 'auto';
                            }
                        });
                    } else {
                        // Full animation for capable devices
                        const tl = gsap.timeline({ delay: staggerDelay });

                        // Phase 1: Rise
                        tl.to(card, {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            rotation: initialRot,
                            duration: riseDuration,
                            ease: 'power3.out',
                            force3D: true,
                        });

                        // Phase 2: Pause
                        tl.to(card, {
                            rotation: initialRot,
                            duration: pauseDuration,
                            ease: 'none',
                        });

                        // Phase 3: Spread
                        tl.to(card, {
                            x: targetX,
                            y: targetY,
                            rotation: targetRot,
                            duration: spreadDuration,
                            ease: 'power2.out',
                            force3D: true,
                            onComplete: () => {
                                // Clean up will-change after animation to free GPU memory
                                if (card) card.style.willChange = 'auto';
                            }
                        });
                    }
                });

                animationComplete.current = true;
            }, containerRef);
        };

        runAnimation();

        return () => {
            if (ctx) {
                ctx.revert();
            }
        };
    }, [displayImages, prefersReducedMotion, isMobile, preloaderDone, isLowPower]);

    // Reset animation when screen size changes significantly
    useEffect(() => {
        animationComplete.current = false;
    }, [isMobile]);

    return (
        <section className="hero-experimental" ref={containerRef}>
            {/* Header Text */}
            <div className={`hero-exp-header ${preloaderDone ? 'animated' : ''}`}>
                <span className="hero-exp-tagline">Capturing Timeless</span>
                <h1 className="hero-exp-title" style={{color:"#3b82f6"}}>Moments</h1>
            </div>

            {/* Image Spread Area */}
            <div className="hero-exp-spread">
                {displayImages.map((img, idx) => (
                    <div
                        key={img.id}
                        ref={(el) => (cardRefs.current[idx] = el)}
                        className="hero-exp-card"
                        style={{ zIndex: 20 - idx }}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            draggable={false}
                            loading="eager"
                        />
                    </div>
                ))}
            </div>

            {/* Bottom Content */}
            <div className={`hero-exp-bottom ${preloaderDone ? 'animated' : ''}`}>
                <p className="hero-exp-description">
                    Elevate your special moments with stunning, contemporary photography crafted
                    to capture the essence of your celebrations with elegance and artistry.
                </p>
                <button className="hero-exp-cta">
                    contact us
                </button>
            </div>
        </section>
    );
};

export default React.memo(HeroExperimental);
