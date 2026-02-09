import React, { useEffect, useRef, useState, useCallback, memo } from 'react';

const STATS_DATA = [
    { value: 500, suffix: '+', label: 'Weddings Shot' },
    { value: 10000, suffix: '+', label: 'Photos Delivered' },
    { value: 50, suffix: '+', label: '5-Star Reviews' }
];

const ANIMATION_DURATION = 2000; // ms

// Cache GSAP module reference
let gsapModule = null;
let ScrollTriggerModule = null;

const getGsap = async () => {
    if (!gsapModule) {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        gsapModule = gsap;
        ScrollTriggerModule = ScrollTrigger;
    }
    return { gsap: gsapModule, ScrollTrigger: ScrollTriggerModule };
};

// Easing function - cubic ease out
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// Memoized stat item to prevent unnecessary re-renders
const StatItem = memo(({ value, suffix, label }) => {
    const formattedValue = value >= 1000 ? value.toLocaleString() : value.toString();
    return (
        <div className="stat-item">
            <div className="stat-value">
                {formattedValue}{suffix}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
});

const Stats = () => {
    const sectionRef = useRef(null);
    const hasAnimatedRef = useRef(false); // Use ref instead of state to avoid re-renders
    const animationFrameRef = useRef(null);
    const [counts, setCounts] = useState(() => STATS_DATA.map(() => 0));

    useEffect(() => {
        let ctx;

        (async () => {
            const { gsap, ScrollTrigger } = await getGsap();

            ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    once: true,
                    onEnter: () => {
                        if (hasAnimatedRef.current) return;
                        hasAnimatedRef.current = true;

                        const startTime = performance.now();

                        const animate = (currentTime) => {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
                            const easedProgress = easeOutCubic(progress);

                            // Single state update for all counters (batched)
                            setCounts(
                                STATS_DATA.map(stat => Math.floor(easedProgress * stat.value))
                            );

                            if (progress < 1) {
                                animationFrameRef.current = requestAnimationFrame(animate);
                            }
                        };

                        animationFrameRef.current = requestAnimationFrame(animate);
                    }
                });
            });
        })();

        return () => {
            ctx?.revert();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []); // Empty dependency array - effect runs once

    return (
        <section className="stats-section" ref={sectionRef}>
            <div className="stats-container">
                {STATS_DATA.map((stat, index) => (
                    <StatItem
                        key={stat.label}
                        value={counts[index]}
                        suffix={stat.suffix}
                        label={stat.label}
                    />
                ))}
            </div>
        </section>
    );
};

export default memo(Stats);

