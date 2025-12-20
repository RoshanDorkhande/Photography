import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [works, setWorks] = useState([]);
    const [heroSettings, setHeroSettings] = useState({
        title1: "Capture",
        title2: "Timeless",
        subtitle1: "The Unseen",
        subtitle2: "Moments"
    });
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Default initial state (empty until fetch)
    const [aboutData, setAboutData] = useState({
        bio1: "",
        bio2: "",
        bio3: "",
        email: "",
        instagram: "",
        img: "",
        signatureName: "",
        signatureRole: ""
    });
    const [galleryImages, setGalleryImages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);


    // Fetch Initial Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/data`);
                const data = await res.json();
                setServices(data.services);
                setWorks(data.works);
                setHeroSettings(data.heroSettings);
                setGalleryImages(data.galleryImages);
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

    const updateWork = async (index, updatedWork) => {
        try {
            const res = await fetch(`${API_URL}/works/${index}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedWork)
            });
            const savedWork = await res.json();
            const newWorks = [...works];
            newWorks[index] = savedWork;
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
            services,
            works,
            heroSettings,
            aboutData,
            galleryImages,
            addService,
            updateService,
            deleteService,
            updateWork,
            updateHero,
            updateAbout,
            addGalleryImage,
            updateGalleryImage,
            deleteGalleryImage,
            reviews,
            addReview,
            updateReview,
            deleteReview
        }}>
            {children}
        </DataContext.Provider>
    );
};
