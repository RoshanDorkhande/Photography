const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Models
const Service = require('../models/Service');
const Work = require('../models/Work');
const Hero = require('../models/Hero');
const About = require('../models/About');

const GalleryImage = require('../models/GalleryImage');
const Review = require('../models/Review');

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- PUBLIC ROUTES ---

// GET All Data (Bootstrap the frontend)
router.get('/data', async (req, res) => {
    try {
        const [services, works, hero, galleryImages, about, reviews] = await Promise.all([
            Service.find(),
            Work.find(),
            Hero.findOne(),
            GalleryImage.find(),
            About.findOne(),
            Review.find()
        ]);


        // Return data directly (Seed script ensures defaults exist)
        res.json({
            services: services,
            works: works,
            heroSettings: hero || {},
            galleryImages: galleryImages,
            aboutData: about || {},
            reviews: reviews || []
        });

    } catch (err) {
        console.error("GET /data Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- ADMIN ROUTES ---

// Generic Upload
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: `photography-portfolio/general`,
        });

        res.json({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
        console.error("Generic Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 1. Services
router.post('/services', async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.json(newService);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/services/:id', async (req, res) => {
    try {
        await Service.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Works
router.put('/works/:index', async (req, res) => {
    try {
        const { id, ...updateData } = req.body;

        // Handle image replacement/deletion
        const oldWork = await Work.findOne({ id: id });
        if (oldWork && oldWork.imgPublicId && updateData.imgPublicId && oldWork.imgPublicId !== updateData.imgPublicId) {
            await cloudinary.uploader.destroy(oldWork.imgPublicId);
        }

        const updatedWork = await Work.findOneAndUpdate({ id: id }, updateData, { new: true, upsert: true });
        res.json(updatedWork);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Hero
router.post('/hero', async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) {
            hero = new Hero(req.body);
        } else {
            hero.set(req.body);
        }
        await hero.save();
        res.json(hero);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. About Section
router.post('/about', async (req, res) => {
    try {
        let about = await About.findOne();

        // Handle image replacement
        if (about && about.imgPublicId && req.body.imgPublicId && about.imgPublicId !== req.body.imgPublicId) {
            await cloudinary.uploader.destroy(about.imgPublicId);
        }

        if (!about) {
            about = new About(req.body);
        } else {
            about.set(req.body);
        }
        await about.save();
        res.json(about);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Gallery Images (Service Specific)
router.post('/images', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: `photography-portfolio/${req.body.serviceId}`,
        });

        const newImage = new GalleryImage({
            id: result.public_id,
            serviceId: req.body.serviceId,
            src: result.secure_url,
            caption: req.body.caption || ''
        });

        await newImage.save();
        res.json(newImage);

    } catch (err) {
        console.error("POST /images Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/images/:id', async (req, res) => {
    try {
        const updatedImage = await GalleryImage.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, upsert: true }
        );
        res.json(updatedImage);
    } catch (err) {
        console.error(`PUT /images/${req.params.id}: Error`, err);
        res.status(500).json({ error: err.message });
    }
});

// Updated DELETE to handle slashes in ID using query param
router.delete('/images', async (req, res) => {
    try {
        const { id } = req.query; // Use query param for robust ID handling
        if (!id) return res.status(400).json({ message: 'Image ID required' });

        await cloudinary.uploader.destroy(id);
        await GalleryImage.findOneAndDelete({ id: id });
        res.json({ message: 'Image deleted' });
    } catch (err) {
        console.error("DELETE /images Error:", err);
        res.status(500).json({ error: err.message });
    }
});


// 6. Reviews
router.post('/reviews', async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.json(newReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/reviews/:id', async (req, res) => {
    try {
        const oldReview = await Review.findById(req.params.id);

        // Handle image replacement
        if (oldReview && oldReview.avatarPublicId && req.body.avatarPublicId && oldReview.avatarPublicId !== req.body.avatarPublicId) {
            await cloudinary.uploader.destroy(oldReview.avatarPublicId);
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/reviews/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review && review.avatarPublicId) {
            await cloudinary.uploader.destroy(review.avatarPublicId);
        }
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
