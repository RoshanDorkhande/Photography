import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onOpen }) => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleAboutClick = () => {
        navigate('/about');
        setIsMobileMenuOpen(false);
    };

    const handleBookClick = () => {
        onOpen();
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav>
                <div className="logo">Skyline<br />Films.</div>

                {/* Desktop Menu */}
                <div className="nav-links desktop-menu">
                    <button onClick={() => navigate('/about')} className="menu-btn hover-trigger" style={{ background: 'transparent', color: 'inherit', cursor: 'pointer', marginRight: '0.5rem' }}>
                        About
                    </button>
                    <button onClick={onOpen} className="menu-btn hover-trigger" style={{ background: 'transparent', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Book a Shoot <i className="fas fa-arrow-right btn-icon"></i>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn hover-trigger" onClick={toggleMenu}>
                    Menu
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <button className="mobile-menu-close-btn hover-trigger" onClick={toggleMenu}>
                    Close
                </button>
                <div className="mobile-menu-content">
                    <button onClick={handleAboutClick} className="mobile-menu-item hover-trigger">About</button>
                    <button onClick={handleBookClick} className="mobile-menu-item hover-trigger">Book a Shoot</button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
