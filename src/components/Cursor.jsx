import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const Cursor = () => {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);
    const [isHoveringWhite, setIsHoveringWhite] = useState(false);
    const location = useLocation();
    const isDark = location.pathname === '/about' || isHoveringWhite;

    // Store mouse position in ref to avoid re-renders
    const mousePos = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);

    useEffect(() => {
        const cursorDot = dotRef.current;
        const cursorOutline = outlineRef.current;

        // Use transform instead of left/top for better performance
        const updateCursor = () => {
            if (cursorDot) {
                cursorDot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
            }
            if (cursorOutline) {
                cursorOutline.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
            }
        };

        // Throttled mouse move handler using RAF
        const moveCursor = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;

            // Cancel any pending animation frame
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }

            // Schedule update on next frame
            rafId.current = requestAnimationFrame(updateCursor);
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });

        // Hover effects - debounced
        let hoverTimeout;
        const handleMouseOver = (e) => {
            // Clear previous timeout
            clearTimeout(hoverTimeout);

            hoverTimeout = setTimeout(() => {
                if (e.target.closest('.hover-trigger') || e.target.closest('a') || e.target.closest('button')) {
                    cursorOutline?.classList.add('hovered');
                } else {
                    cursorOutline?.classList.remove('hovered');
                }

                // Check for white background sections
                if (e.target.closest('#contact') || e.target.closest('.white-section')) {
                    setIsHoveringWhite(true);
                } else {
                    setIsHoveringWhite(false);
                }
            }, 16); // ~60fps
        };

        document.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
            clearTimeout(hoverTimeout);
        };
    }, []);

    return (
        <>
            <div
                className={`cursor-dot ${isDark ? 'dark' : ''}`}
                ref={dotRef}
                style={{ willChange: 'transform' }}
            />
            <div
                className={`cursor-outline ${isDark ? 'dark' : ''}`}
                ref={outlineRef}
                style={{ willChange: 'transform' }}
            />
        </>
    );
};

export default Cursor;
