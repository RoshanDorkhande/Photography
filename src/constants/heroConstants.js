// Hero section constants for the experimental card spread animation
import img1 from '../Images/optimized/11.webp';
import img2 from '../Images/optimized/22.webp';
import img3 from '../Images/optimized/33.webp';
import img4 from '../Images/optimized/44.webp';
import img5 from '../Images/optimized/Work/Bride.webp';
import img6 from '../Images/optimized/Work/Ghunghat.webp';

// Pattern: Extreme(Upper) -> Adjacent(Lower) -> Middle(Center) -> Middle(Center) -> Adjacent(Lower) -> Extreme(Upper)
// X range ~1350px total spread to ensure 240px wide images don't overlap
export const HERO_IMAGES = [
    {
        id: 1,
        src: img1,
        alt: "Wedding photography 1",
        rotation: -12,
        xOffset: -670,
        yOffset: -50, // Extreme Left: Upper
    },
    {
        id: 2,
        src: img2,
        alt: "Wedding photography 2",
        rotation: -6,
        xOffset: -400,
        yOffset: 70,  // Adjacent Left: Lower
    },
    {
        id: 3,
        src: img3,
        alt: "Wedding photography 3",
        rotation: -2,
        xOffset: -135,
        yOffset: 0,   // Middle Left: Center
    },
    {
        id: 4,
        src: img4,
        alt: "Wedding photography 4",
        rotation: 2,
        xOffset: 135,
        yOffset: 0,   // Middle Right: Center
    },
    {
        id: 5,
        src: img5,
        alt: "Bridal portrait",
        rotation: 6,
        xOffset: 400,
        yOffset: 70,  // Adjacent Right: Lower
    },
    {
        id: 6,
        src: img6,
        alt: "Traditional wedding moment",
        rotation: 12,
        xOffset: 670,
        yOffset: -50, // Extreme Right: Upper
    },
];

export const ANIMATION_TIMING = {
    initialDelay: 0.4,
    riseDuration: 1.1,
    pauseDuration: 0.5,
    spreadDuration: 1.3, // Slowed down for cinematic impact
};

// Messy stack rotation values for the rise phase
export const MESSY_ROTATIONS = [-12, 10, -5, 8, -7, 6];
