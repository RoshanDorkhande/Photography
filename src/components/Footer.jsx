import React from 'react';

const Footer = () => {
    return (
        <footer id="contact">
            <div className="footer-cta">
                <p style={{ textTransform: 'uppercase', marginBottom: '1rem', color: '#666' }}>Have a project?</p>
                <h2>Let's Make <br /> <span>IT Happen.</span></h2>
            </div>

            <div className="footer-bottom">
                <div className="footer-main-content">
                    <div className="footer-brand">
                        <h3>Skyline Films</h3>
                        <p className="brand-desc">Delivering premium quality photoshoots for weddings, commercials, and events. We turn moments into timeless memories.</p>
                    </div>

                    <div className="footer-details">
                        <div className="footer-col">
                            <h4>Address</h4>
                            <p>Near Senior College,<br />Main Road, Bhadravati.</p>
                        </div>

                        <div className="footer-col">
                            <h4>Contact</h4>
                            <a href="tel:7719957189" className="icon-link">
                                <i className="fas fa-phone-alt"></i> <span>7719957189</span>
                            </a>
                            <a href="mailto:skylinefilms@gmail.com" className="icon-link">
                                <i className="fas fa-envelope"></i> <span>skylinefilms@gmail.com</span>
                            </a>
                        </div>

                        <div className="footer-col">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                <a href="https://www.instagram.com/skylinefilms_02?igsh=a2twbWQxc28yb3Q5" target="_blank" rel="noopener noreferrer" className="hover-trigger social-icon">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://wa.me/7719957189" target="_blank" rel="noopener noreferrer" className="hover-trigger social-icon">
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-copyright">
                    <p>Website by <a href="https://www.instagram.com/roshan_dorkhande?igsh=czl2azZzOWpkdnJr" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold' }}>roshh <span style={{ color: 'var(--accent)' }}>↗ @2025 All rights reserved</span></a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
