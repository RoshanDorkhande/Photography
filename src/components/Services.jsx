import { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './Icons';

const Services = () => {
    const navigate = useNavigate();
    const { services } = useData();
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

        const rows = sectionRef.current?.querySelectorAll('.service-row');
        rows?.forEach((row) => observer.observe(row));

        return () => {
            rows?.forEach((row) => observer.unobserve(row));
        };
    }, [services]);

    return (
        <>
            <div className="services-header" style={{ display: 'block', textAlign: 'center' }}>
                <h2 className="services-section-title" style={{ display: 'block', fontSize: '2.2rem', fontWeight: '300', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    What We <span style={{ color: '#3b82f6', fontWeight: '500' }}>Offer</span>
                </h2>
            </div>
            <section className="services-section" ref={sectionRef}>

                {services.map((service, index) => (
                    <div
                        className="service-row hover-trigger"
                        key={index}
                        onClick={() => navigate(`/service/${service.id}`)}
                    >
                        <ArrowRightIcon className="service-icon" size={24} />
                        <div className="service-name">{service.name}</div>
                        <div className="service-tags">{service.tags}</div>
                    </div>
                ))}
            </section>
        </>
    );
};

export default Services;
