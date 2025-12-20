const mongoose = require('mongoose');
const Service = require('./models/Service');
const Work = require('./models/Work');
const Hero = require('./models/Hero');
const About = require('./models/About');
const GalleryImage = require('./models/GalleryImage');

const DEFAULT_SERVICES = [
    { name: "Photography", tags: "Editorial / Product / Event", id: "photography" },
    { name: "Film Production", tags: "Commercial / Music Video / Doc", id: "film-production" },
    { name: "Post-Production", tags: "Color Grading / VFX / Sound", id: "post-production" }
];

const DEFAULT_WORKS = [
    { id: 1, img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", cat: "Campaign", title: "Alpine Lights" },
    { id: 2, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", cat: "Editorial", title: "Vogue Urban" },
    { id: 3, img: "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", cat: "Architecture", title: "Concrete Dreams" },
    { id: 4, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", cat: "Event", title: "Neon Nights" }
];

const DEFAULT_HERO = {
    title1: "Capture",
    title2: "Timeless",
    subtitle1: "The Unseen",
    subtitle2: "Moments"
};

const DEFAULT_ABOUT = {
    bio1: "Founded in 2020, Skyline Films is a creative studio dedicated to capturing the unseen moments that define our lives.",
    bio2: "We believe in the power of visual storytelling to evoke emotion and preserve memories.",
    bio3: "Our team of passionate photographers and filmmakers work tirelessly to deliver cinematic quality in every frame. Whether it's a wedding, a commercial project, or a personal portrait, we bring a unique artistic vision to every shoot.",
    email: "contact@skylinefilms.com",
    instagram: "@skylinefilms",
    // This is the default from the frontend context
    img: "https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=1000",
    signatureName: "Hemant Ekre",
    signatureRole: "Founder"
};

const generateDefaultImages = (serviceId) => {
    return Array.from({ length: 25 }, (_, i) => ({
        id: `${serviceId}-${i}`,
        serviceId: serviceId,
        src: `https://picsum.photos/600/800?random=${i + (serviceId === 'photography' ? 100 : serviceId === 'film-production' ? 200 : 300)}`,
        caption: `Project ${i + 1}`
    }));
};

const seedDatabase = async () => {
    try {
        // 1. Services
        const serviceCount = await Service.countDocuments();
        if (serviceCount === 0) {
            await Service.insertMany(DEFAULT_SERVICES);
            console.log('Services seeded');
        }

        // 2. Works
        const workCount = await Work.countDocuments();
        if (workCount === 0) {
            await Work.insertMany(DEFAULT_WORKS);
            console.log('Works seeded');
        }

        // 3. Hero
        const heroCount = await Hero.countDocuments();
        if (heroCount === 0) {
            await Hero.create(DEFAULT_HERO);
            console.log('Hero settings seeded');
        }

        // 4. About
        const aboutCount = await About.countDocuments();
        if (aboutCount === 0) {
            await About.create(DEFAULT_ABOUT);
            console.log('About section seeded');
        }

        // 5. Gallery Images
        const imageCount = await GalleryImage.countDocuments();
        if (imageCount === 0) {
            let allImages = [];
            DEFAULT_SERVICES.forEach(service => {
                const images = generateDefaultImages(service.id);
                allImages = [...allImages, ...images];
            });
            await GalleryImage.insertMany(allImages);
            console.log('Gallery images seeded');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;
