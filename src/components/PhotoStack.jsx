import React, { useState, useEffect } from 'react';
import './Photostack.css';
import img1 from '../Images/optimized/11.webp';
import img2 from '../Images/optimized/22.webp';
import img3 from '../Images/optimized/33.webp';
import img4 from '../Images/optimized/44.webp';

const PhotoStack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { id: 1, src: img1, alt: "Photo 1" },
    { id: 2, src: img2, alt: "Photo 2" },
    { id: 3, src: img3, alt: "Photo 3" },
    { id: 4, src: img4, alt: "Photo 4" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="image-stack simple"
    fetchPriority='high'>
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        className="hero-image"
        
      />
    </div>
  );
};

export default PhotoStack;