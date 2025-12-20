/**
 * Utility function to optimize Cloudinary image URLs
 * Adds automatic format, quality, and optional width transformations
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
    if (!url || typeof url !== 'string') return url;

    // Only process Cloudinary URLs
    if (!url.includes('res.cloudinary.com')) return url;

    const { width, quality = 'auto' } = options;

    // Check if transformations already exist
    if (url.includes('/f_auto') || url.includes('/q_auto')) {
        return url;
    }

    // Build transformations - width is optional
    let transformations = `f_auto,q_${quality}`;
    if (width) {
        transformations += `,w_${width}`;
    }

    // Handle URLs with or without version (v123456)
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const beforeUpload = url.substring(0, uploadIndex + 8); // includes '/upload/'
    const afterUpload = url.substring(uploadIndex + 8);

    return `${beforeUpload}${transformations}/${afterUpload}`;
};

/**
 * Get optimized image URL for different contexts
 * - 'auto': Just format and quality optimization, no resizing
 * - 'thumbnail': Small preview (400px)
 * - 'gallery': Medium size (600px) 
 * - 'lightbox': Full quality view (1600px)
 * - 'hero': Large display (1200px)
 */
export const getOptimizedImageUrl = (url, context = 'auto') => {
    const configs = {
        auto: { quality: 'auto' },  // No width - Cloudinary serves original size with optimization
        thumbnail: { width: 400, quality: 'auto' },
        gallery: { width: 600, quality: 'auto' },
        lightbox: { width: 1600, quality: 'auto:best' },
        hero: { width: 1200, quality: 'auto' }
    };

    return optimizeCloudinaryUrl(url, configs[context] || configs.auto);
};
