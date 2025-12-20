import React, { useState, useEffect } from 'react';
import './Photostack.css';
import img1 from '../Images/11.JPG';
import img2 from '../Images/22.JPG';
import img3 from '../Images/33.JPG';
import img4 from '../Images/44.JPG';

const PhotoStack = () => {
  // Initial list of images
  const [images, setImages] = useState([
    { id: 1, src: img1, alt: "Landscape" },
    { id: 2, src: img2, alt: "Mountain" },
    { id: 3, src: img3, alt: "Nature" },
    { id: 4, src: img4, alt: "Top Image" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImages((prevImages) => {
        // Create a copy of the array
        const newArr = [...prevImages];
        // Remove the first item (the one at the bottom of the stack)
        const itemToMove = newArr.shift();
        // Add it to the end (making it the new top image)
        newArr.push(itemToMove);
        return newArr;
      });
    }, 2000); // Change every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="image-stack">
      <div className="ambient-glow"></div>
      {images.map((image) => (
        <img
          key={image.id} // logic relies on unique IDs to track movement
          src={image.src}
          alt={image.alt}
        />
      ))}
    </div>
  );
};

export default PhotoStack;