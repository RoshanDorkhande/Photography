import React from 'react';
import './BookingModal.css';
import { WhatsAppIcon, InstagramIcon, EnvelopeOutlineIcon } from './Icons';

const BookingModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close hover-trigger" onClick={onClose}>&times;</button>
                <h2 className="modal-title">Get in Touch</h2>
                <p className="modal-subtitle">We'd love to hear from you. Reach out via:</p>

                <div className="contact-links">
                    <a href="https://wa.me/7719957189" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp hover-trigger">
                        <WhatsAppIcon size={22} />
                        <span>WhatsApp</span>
                    </a>

                    <a href="https://www.instagram.com/skylinefilms_02?igsh=a2twbWQxc28yb3Q5" target="_blank" rel="noopener noreferrer" className="contact-btn instagram hover-trigger">
                        <InstagramIcon size={22} />
                        <span>Instagram</span>
                    </a>

                    <a href="mailto:contact@skylinefilms.com" className="contact-btn email hover-trigger">
                        <EnvelopeOutlineIcon size={22} />
                        <span>Gmail</span>
                    </a>
                </div>
            </div>

            {/* <style jsx>{`
                .contact-modal {
                    text-align: center;
                    max-width: 400px;
                    padding: 2.5rem;
                }
                .modal-subtitle {
                    margin-bottom: 2rem;
                    color: #666;
                }
                .contact-links {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .contact-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 1rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    color: white;
                    font-size: 1.1rem;
                }
                .contact-btn i {
                    font-size: 1.4rem;
                }
                .whatsapp {
                    background-color: #25D366;
                }
                .whatsapp:hover {
                    background-color: #128C7E;
                }
                .instagram {
                    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                }
                .instagram:hover {
                    opacity: 0.9;
                }
                .email {
                    background-color: #EA4335;
                }
                .email:hover {
                    background-color: #c0392b;
                }
            `}</style> */}
        </div>
    );
};

export default BookingModal;
