import React, { useState } from 'react';
import Preloader from './Preloader';
import Navbar from './Navbar';
import Hero from './Hero';
import HeroExperimental from './HeroExperimental';
import Marquee from './Marquee';
import WorkGrid from './WorkGrid';
import Marquee2 from './Marquee2';
import Services from './Services';
import Stats from './Stats';
import Reviews from './Reviews';
import Footer from './Footer';
import BookingModal from './BookingModal';

// Toggle to switch between hero variants for A/B testing
// Set to true to use the new experimental card spread hero
const USE_EXPERIMENTAL_HERO = true;

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Preloader />
            <Navbar onOpen={() => setIsModalOpen(true)} />
            {USE_EXPERIMENTAL_HERO ? <HeroExperimental /> : <Hero />}
            <Marquee />
            <WorkGrid />
            <Marquee2 />
            <Services />
            <Stats />
            <Reviews />
            <Footer />
            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Home;
