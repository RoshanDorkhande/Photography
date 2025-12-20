import React, { useEffect, useState } from 'react';

let hasShown = false;

const Preloader = () => {
    const [visible, setVisible] = useState(!hasShown);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
                hasShown = true;
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const style = {
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
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
    };

    return (
        <div style={style}>
            <div style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 900,
                fontSize: '2rem',
                color: '#000',
                textTransform: 'uppercase',
                letterSpacing: '-1px'
            }}>
                Skyline.
            </div>
        </div>
    );
};

export default Preloader;
