import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

// Default fallback data - shown while backend is spinning up
const DEFAULT_HERO = {
    title1: 'Capture',
    title2: 'Timeless',
    subtitle1: 'The Unseen',
    subtitle2: 'moments'
};

const DEFAULT_SERVICES = [
    { id: 'weddings', name: 'Weddings', tags: 'Candid • Traditional • Cinematic' },
    { id: 'events', name: 'Events', tags: 'Corporate • Birthday • Celebrations' },
    { id: 'portraits', name: 'Portraits', tags: 'Studio • Outdoor • Creative' }
];

const DEFAULT_WORKS = [
    { id: 1, title: 'Wedding Photography', cat: 'Wedding', img: 'https://res.cloudinary.com/dtthtgzce/image/upload/v1765887375/photography-portfolio/general/lxlq0ssfjulesx0r28fn.jpg' },
    { id: 2, title: 'Pre-Wedding Shoot', cat: 'Pre-Wedding', img: 'https://res.cloudinary.com/dtthtgzce/image/upload/v1765887825/photography-portfolio/general/v922wrev1z01cjjqn7k3.jpg' },
    { id: 3, title: 'Event Coverage', cat: 'Events', img: 'https://res.cloudinary.com/dtthtgzce/image/upload/v1765888230/photography-portfolio/general/ijh3wezz91pz1ksxtoaw.jpg' },
    { id: 4, title: 'Portrait Session', cat: 'Portrait', img: 'https://res.cloudinary.com/dtthtgzce/image/upload/v1765889481/photography-portfolio/general/s5lvphyr30lijwhxnp56.jpg' }
];

const DEFAULT_ABOUT = {
    title: 'About Skyline Films',
    description: 'We are passionate photographers dedicated to capturing your precious moments.',
    img: 'https://res.cloudinary.com/dtthtgzce/image/upload/v1765225828/photography-portfolio/photography/obfhkakxgoqiq6qwlffy.jpg'
};

const DEFAULT_REVIEWS = [
    { _id: '1', author: 'Happy Client', role: 'Wedding', quote: 'Amazing work! They captured our special day beautifully.', avatar: '' },
    { _id: '2', author: 'Satisfied Customer', role: 'Event', quote: 'Professional and creative. Highly recommended!', avatar: '' }
];

export const DataProvider = ({ children }) => {
    const [services, setServices] = useState(DEFAULT_SERVICES);
    const [works, setWorks] = useState(DEFAULT_WORKS);
    const [heroSettings, setHeroSettings] = useState(DEFAULT_HERO);
    const [galleryImages, setGalleryImages] = useState([]);
    const [aboutData, setAboutData] = useState(DEFAULT_ABOUT);
    const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
    const [loading, setLoading] = useState(true);

    // API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/data`);
                const data = await res.json();
                setServices(data.services || []);
                setWorks(data.works || []);
                setHeroSettings(data.heroSettings || {});
                setGalleryImages(data.galleryImages || []);
                setAboutData(data.aboutData || {});
                setReviews(data.reviews || []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Actions
    const addService = async (service) => {
        const newService = { ...service, id: service.name.toLowerCase().replace(/\s+/g, '-') };
        try {
            const res = await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newService)
            });
            const savedService = await res.json();
            setServices([...services, savedService]);
        } catch (err) {
            console.error(err);
        }
    };

    const updateService = (index, updatedService) => {
        // Implementation for update if needed via API, for now just state
        const newServices = [...services];
        newServices[index] = updatedService;
        setServices(newServices);
    };

    const deleteService = async (index) => {
        const serviceToDelete = services[index];
        try {
            await fetch(`${API_URL}/services/${serviceToDelete.id}`, { method: 'DELETE' });
            const newServices = services.filter((_, i) => i !== index);
            setServices(newServices);
        } catch (err) {
            console.error(err);
        }
    };

    const addWork = async (work) => {
        // Generate a simple numeric ID if not present (or use timestamp)
        const newWork = { ...work, id: work.id || Date.now() };
        try {
            const res = await fetch(`${API_URL}/works`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWork)
            });
            const savedWork = await res.json();
            setWorks([...works, savedWork]);
        } catch (err) {
            console.error(err);
        }
    };

    const updateWork = async (index, updatedWork) => {
        try {
            const res = await fetch(`${API_URL}/works/${index}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedWork)
            });
            const savedWork = await res.json();
            const newWorks = [...works];
            // Find index by ID if possible, or assume index matches
            // Ideally we should map by ID
            const workIndex = works.findIndex(w => w.id === updatedWork.id);
            if (workIndex !== -1) {
                newWorks[workIndex] = savedWork;
            } else {
                // Fallback if index was passed directly
                newWorks[index] = savedWork;
            }
            setWorks(newWorks);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteWork = async (index) => {
        const workToDelete = works[index];
        if (!workToDelete) return;
        try {
            await fetch(`${API_URL}/works/${workToDelete.id}`, { method: 'DELETE' });
            const newWorks = works.filter((_, i) => i !== index);
            setWorks(newWorks);
        } catch (err) {
            console.error(err);
        }
    };

    const updateHero = async (settings) => {
        try {
            const res = await fetch(`${API_URL}/hero`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            const savedHero = await res.json();
            setHeroSettings(savedHero);
        } catch (err) {
            console.error(err);
        }
    };

    // About Actions
    const updateAbout = async (data) => {
        try {
            const res = await fetch(`${API_URL}/about`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const savedAbout = await res.json();
            setAboutData(savedAbout);
        } catch (err) {
            console.error(err);
        }
    };

    // Gallery Image Actions
    const addGalleryImage = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/images`, {
                method: 'POST',
                body: formData
            });
            const savedImage = await res.json();
            setGalleryImages(prev => [...prev, savedImage]);
        } catch (err) {
            console.error(err);
            alert("Failed to upload image");
        }
    };

    const updateGalleryImage = async (id, updatedImage) => {
        try {
            const res = await fetch(`${API_URL}/images/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedImage)
            });
            // Update state
            setGalleryImages(galleryImages.map(img => img.id === id ? updatedImage : img));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteGalleryImage = async (id) => {
        try {
            // Encode the ID to safely handle slashes in public_id
            await fetch(`${API_URL}/images?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
            setGalleryImages(galleryImages.filter(img => img.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Reviews Actions
    const addReview = async (review) => {
        try {
            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review)
            });
            const savedReview = await res.json();
            setReviews([...reviews, savedReview]);
        } catch (err) {
            console.error(err);
        }
    };

    const updateReview = async (id, updatedReview) => {
        try {
            const res = await fetch(`${API_URL}/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedReview)
            });
            const savedReview = await res.json();
            setReviews(reviews.map(r => r._id === id ? savedReview : r));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteReview = async (id) => {
        try {
            await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
            setReviews(reviews.filter(r => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DataContext.Provider value={{
            services, works, heroSettings, galleryImages, aboutData, reviews,
            addService, updateService, deleteService,
            addWork, updateWork, deleteWork,
            updateHero,
            updateAbout,
            addGalleryImage, updateGalleryImage, deleteGalleryImage,
            addReview, updateReview, deleteReview
        }}>
            {children}
        </DataContext.Provider>
    );
};
