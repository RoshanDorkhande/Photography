import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Cursor = () => {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);
    const [isHoveringWhite, setIsHoveringWhite] = useState(false);
    const location = useLocation();
    const isDark = location.pathname === '/about' || isHoveringWhite;

    useEffect(() => {
        const cursorDot = dotRef.current;
        const cursorOutline = outlineRef.current;

        const moveCursor = (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            if (cursorDot) {
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
            }

            if (cursorOutline) {
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 500, fill: "forwards" });
            }
        };

        window.addEventListener("mousemove", moveCursor);

        // Hover effects
        const handleMouseEnter = () => cursorOutline?.classList.add('hovered');
        const handleMouseLeave = () => cursorOutline?.classList.remove('hovered');

        // Global event delegation for hover effects
        const handleMouseOver = (e) => {
            if (e.target.closest('.hover-trigger') || e.target.closest('a') || e.target.closest('button')) {
                cursorOutline?.classList.add('hovered');
            } else {
                cursorOutline?.classList.remove('hovered');
            }

            // Check for white background sections (e.g., Footer)
            if (e.target.closest('#contact') || e.target.closest('.white-section')) {
                setIsHoveringWhite(true);
            } else {
                setIsHoveringWhite(false);
            }
        };

        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <div className={`cursor-dot ${isDark ? 'dark' : ''}`} ref={dotRef}></div>
            <div className={`cursor-outline ${isDark ? 'dark' : ''}`} ref={outlineRef}></div>
        </>
    );
};

export default Cursor;
