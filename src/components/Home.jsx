import React, { useState } from 'react';
import Preloader from './Preloader';
import Navbar from './Navbar';
import Hero from './Hero';
import Marquee from './Marquee';
import WorkGrid from './WorkGrid';
import Marquee2 from './Marquee2';
import Services from './Services';
import Reviews from './Reviews';
import Footer from './Footer';
import BookingModal from './BookingModal';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Preloader />
            <Navbar onOpen={() => setIsModalOpen(true)} />
            <Hero />
            <Marquee />
            <WorkGrid />
            <Marquee2 />
            <Services />
            <Reviews />
            <Footer />
            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Home;
