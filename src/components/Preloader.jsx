import React, { useEffect, useState, useRef, useMemo, memo } from 'react';

let hasShown = false;

const WORDS = ['Lights', 'Camera', 'Action'];
const WORD_DURATION = 800; // milliseconds per word
const TOTAL_DURATION = WORDS.length * WORD_DURATION; // 2400ms total
const ACCENT_COLOR = '#3b82f6';

// Static styles moved outside component
const baseStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#fff',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)',
};

const counterStyle = {
    position: 'absolute',
    bottom: '2rem',
    left: '2rem',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 900,
    fontSize: '1.5rem',
    color: '#000',
    letterSpacing: '-1px',
};

const baseWordStyle = {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 900,
    fontSize: '3rem',
    textTransform: 'uppercase',
    letterSpacing: '-2px',
};

const Preloader = () => {
    // Early return if already shown - prevents all hooks from running
    const [shouldRender] = useState(() => !hasShown);

    const [visible, setVisible] = useState(true);
    const [counter, setCounter] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!shouldRender) return;

        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / TOTAL_DURATION, 1);

            // Update counter (throttled to reduce re-renders)
            const newCounter = Math.floor(progress * 100);
            setCounter(prev => prev !== newCounter ? newCounter : prev);

            // Update word index
            const newWordIndex = Math.min(Math.floor(elapsed / WORD_DURATION), WORDS.length - 1);
            setWordIndex(prev => prev !== newWordIndex ? newWordIndex : prev);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Animation complete
                setVisible(false);
                hasShown = true;
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [shouldRender]);

    // Memoize dynamic style to prevent object recreation
    const containerStyle = useMemo(() => ({
        ...baseStyle,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
    }), [visible]);

    const wordStyle = useMemo(() => ({
        ...baseWordStyle,
        color: wordIndex === 2 ? ACCENT_COLOR : '#000',
    }), [wordIndex]);

    // Don't render anything if already shown
    if (!shouldRender) return null;

    return (
        <div style={containerStyle}>
            <div style={wordStyle}>
                {WORDS[wordIndex]}
            </div>
            <div style={counterStyle}>
                {counter}%
            </div>
        </div>
    );
};

export default memo(Preloader);
