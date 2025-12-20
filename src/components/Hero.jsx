import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import RotatingCards from './rotatingcards';
import PhotoStack from './PhotoStack';

const Hero = () => {
    const [isActive, setIsActive] = useState(false);
    const { heroSettings } = useData();

    useEffect(() => {
        const interval = setInterval(() => {
            setIsActive(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="hero">
            <div className="main-hero">
            <div className={`hero-text hover-trigger ${isActive ? 'active' : ''}`}>
                <div className="text-row">
                    <div className="roll-wrapper">
                        <span className="roll-item">{heroSettings.title1}</span>
                        <span className="roll-item hover-txt">{heroSettings.title2}</span>
                    </div>
                </div>

                <div className="text-row">
                    <div className="roll-wrapper">
                        <span className="roll-item" style={{ color: 'var(--text-muted)' }}>{heroSettings.subtitle1}</span>
                        <span className="roll-item hover-txt" style={{ color: 'var(--accent)' }}>{heroSettings.subtitle2}</span>
                    </div>
                </div>
            </div>
            {/* <RotatingCards/> */}
            <PhotoStack/>
            </div>

            <div className="hero-footer">
                <span>Est. 2020</span>
                <span>Scroll Down ↓</span>
                <span>Hemant Ekre</span>
            </div>
        </header>
    );
};

export default Hero;
