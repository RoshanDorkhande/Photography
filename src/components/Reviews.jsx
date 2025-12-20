import React from 'react';
import { useData } from '../context/DataContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';

const Reviews = () => {
    const { reviews } = useData();

    // Duplicate reviews for infinite scroll if we have enough reviews, or just use what we have
    // If empty, maybe show nothing or a placeholder?
    // Let's assume we want at least some reviews to show.
    const displayReviews = reviews.length > 0 ? reviews : [];

    // For infinite scroll effect, we might need to duplicate if there are few items
    const allReviews = displayReviews.length > 0 ? [...displayReviews, ...displayReviews, ...displayReviews] : [];

    if (displayReviews.length === 0) return null; // Don't show section if no reviews

    return (
        <section className="reviews-section">
            <div className="reviews-header" style={{ display: 'block', textAlign: 'center' }}>
                <h2 className="section-title">See What Our <span style={{ color: '#3b82f6', fontWeight: '500' }}>Happy Clients</span> Have To Say About Us.</h2>

            </div>
            <div className="reviews-track">
                <div className="reviews-track-inner">
                    {allReviews.map((review, index) => (
                        <div className="review-card hover-trigger" key={index}>

                            <p className="quote">"{review.quote}"</p>
                            <div className="author">
                                <div className="author-avatar" style={{
                                    backgroundImage: review.avatar ? `url(${getOptimizedImageUrl(review.avatar, 'thumbnail')})` : 'none',
                                    backgroundColor: review.avatar ? '#ddd' : '#f0f0f0',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {!review.avatar && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#999" width="60%" height="60%">
                                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="author-info"><h4>{review.author}</h4><span>{review.role}</span></div>
                                <div className="stars" style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" width="16" height="16">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
