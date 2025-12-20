import React, { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';

const WorkGrid = () => {
    const { works } = useData();
    const sectionRef = useRef(null);
    
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
                rows?.forEach((row) => observer.unobserve(row));
            };
        }, [works]);

    return (
        <section id="work" className="work-grid" ref={sectionRef}>
            {works.map((work, index) => (
                <div className="work-item hover-trigger" key={index}>
                    <img src={work.img} alt={work.title} className="work-img" />
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
