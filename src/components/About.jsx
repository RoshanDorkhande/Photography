import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

const About = () => {
    const navigate = useNavigate();
    const { aboutData } = useData();

    if (!aboutData) return null; 

    return (
        <motion.div
            className="about-page"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 200, overflowY: 'auto' }}
            data-lenis-prevent
        >
            <button className="close-btn hover-trigger" onClick={() => navigate('/')} style={{ position: 'fixed',top: '2rem', right: '4%', left: 'auto', color: '#000', borderColor: '#000' }}>
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
        </motion.div>
    );
};

export default About;
