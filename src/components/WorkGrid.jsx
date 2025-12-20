import React, { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { getOptimizedImageUrl } from '../utils/imageUtils';

const WorkGrid = () => {
    const { works } = useData();
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Only run on mobile/touch devices
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    } else {
                        entry.target.classList.remove('active');
                    }
                });
            },
            {
                root: null,
                rootMargin: '-30% 0px -30% 0px', // Trigger when element is in the middle 40% of viewport
                threshold: 0
            }
        );

        const rows = sectionRef.current?.querySelectorAll('.work-item');
        rows?.forEach((row) => observer.observe(row));

        return () => {
            rows?.forEach((row) => observer.disconnect());
        };
    }, [works]);

    const handleWorkClick = (work) => {
        if (work.serviceId) {
            navigate(`/service/${work.serviceId}`);
        }
    };

    return (
        <section id="work" className="work-grid" ref={sectionRef}>
            {works.map((work, index) => (
                <div
                    className={`work-item hover-trigger ${work.serviceId ? 'clickable' : ''}`}
                    key={index}
                    onClick={() => handleWorkClick(work)}
                    style={{ cursor: work.serviceId ? 'pointer' : 'default' }}
                >
                    <img
                        src={getOptimizedImageUrl(work.img, 'auto')}
                        alt={work.title}
                        className="work-img"
                        loading="lazy"
                    />
                    <div className="work-info">
                        <div className="work-cat">{work.cat}</div>
                        <div className="work-title">{work.title}</div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default WorkGrid;
