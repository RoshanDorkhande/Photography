import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const About = () => {
    const navigate = useNavigate();
    const { aboutData } = useData();
    const containerRef = useRef(null);

    // GSAP animations with dynamic import
    useEffect(() => {
        let ctx;
        (async () => {
            const gsap = (await import('gsap')).default;

            ctx = gsap.context(() => {
                const container = containerRef.current;

                // Slide-up animation
                gsap.fromTo(container,
                    { y: '100%' },
                    {
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    }
                );
            });
        })();

        return () => ctx?.revert();
    }, []);

    // Exit animation
    const handleClose = async () => {
        const gsap = (await import('gsap')).default;
        gsap.to(containerRef.current, {
            y: '100%',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => navigate('/')
        });
    };

    if (!aboutData) return null;

    return (
        <div
            className="about-page"
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 200,
                overflowY: 'auto',
                transform: 'translateY(100%)' // Initial state for GSAP
            }}
            data-lenis-prevent
        >
            <button
                className="close-btn hover-trigger"
                onClick={handleClose}
                style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '4%',
                    left: 'auto',
                    color: '#000',
                    borderColor: '#000'
                }}
            >
                &times;
            </button>

            <div className="about-content">
                <div className="about-image-container">
                    <img
                        src={aboutData.img}
                        alt="Photographer"
                        className="about-image"
                    />
                </div>
                <div className="about-text">
                    <h1 className="about-title">About Skyline Films</h1>
                    <p className="about-description">
                        {aboutData.bio1}
                    </p>
                    <p className="about-description">
                        {aboutData.bio2}
                    </p>
                    <p className="about-description">
                        {aboutData.bio3}
                    </p>
                    <div className="about-signature">
                        <p>{aboutData.signatureName}</p>
                        <span>{aboutData.signatureRole}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
