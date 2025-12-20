import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

const ServiceGallery = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const columnsRef = useRef([]);
    const { galleryImages } = useData();

    // Filter images for this service
    const images = galleryImages.filter(img => img.serviceId === id);

    // Group into 5 columns
    const columns = [[], [], [], [], []];
    images.forEach((img, i) => {
        columns[i % 5].push(img);
    });

    // Specific offsets for that "organic" look
    const offsets = [0, 120, 60, 180, 40];

    useGSAP(() => {
        const cols = columnsRef.current;

        // Initial state: push down
        gsap.set(cols, { y: '150vh' });

        // Animation sequence: Middle (2) -> Neighbors (1,3) -> Outer (0,4)
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 2 }, delay: 0.5 }); // Added delay for page transition

        tl.to(cols[2], { y: 0 })
            .to([cols[1], cols[3]], { y: 0 }, '-=1.8')
            .to([cols[0], cols[4]], { y: 0 }, '-=1.8');

    }, { scope: containerRef });

    return (
        <motion.div
            className="service-gallery"
            ref={containerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 200, overflowY: 'auto' }}
            data-lenis-prevent
        >
            <div className="gallery-header">
                <div className="gallery-title">{id.replace('-', ' ')}</div>
                <button className="close-btn hover-trigger" onClick={() => navigate('/')}>
                    &times;
                </button>
            </div>

            <div className="gallery-grid">
                {columns.map((col, colIndex) => (
                    <div
                        key={colIndex}
                        className="gallery-col"
                        ref={el => columnsRef.current[colIndex] = el}
                        style={{ marginTop: `${offsets[colIndex]}px` }}
                    >
                        {col.map((img) => (
                            <div key={img.id} className="gallery-item">
                                <img src={img.src} alt={`Gallery ${img.id}`} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ServiceGallery;
