import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const { services, works, heroSettings, galleryImages, aboutData, reviews, addService, updateService, deleteService, updateWork, updateHero, updateAbout, addGalleryImage, updateGalleryImage, deleteGalleryImage, addReview, updateReview, deleteReview } = useData();
    const [activeTab, setActiveTab] = useState('services');
    const [selectedService, setSelectedService] = useState(null); // For Image View
    const navigate = useNavigate();

    // API URL for uploads
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Service Form State
    const [newService, setNewService] = useState({ name: '', tags: '' });

    // Work Form State (for editing)
    const [editingWork, setEditingWork] = useState(null);

    // Image Form State
    const [editingImage, setEditingImage] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);

    // Hero Form State
    const [heroForm, setHeroForm] = useState(heroSettings);

    // About Form State
    const [aboutForm, setAboutForm] = useState(aboutData || { bio1: '', bio2: '', bio3: '', email: '', instagram: '', img: '' });

    // Review Form State
    const [newReview, setNewReview] = useState({ quote: '', author: '', role: '', avatar: '' });
    const [editingReview, setEditingReview] = useState(null);

    const handleAddService = async (e) => {
        e.preventDefault();
        if (newService.name && newService.tags) {
            try {
                await addService(newService);
                toast.success('Service added successfully!');
                setNewService({ name: '', tags: '' });
            } catch (err) {
                toast.error('Failed to add service.');
            }
        }
    };

    const handleUpdateWork = async (e) => {
        e.preventDefault();
        try {
            await updateWork(editingWork.index, editingWork.data);
            toast.success('Work updated successfully!');
            setEditingWork(null);
        } catch (err) {
            toast.error('Failed to update work.');
        }
    };

    const handleUpdateHero = async (e) => {
        e.preventDefault();
        try {
            await updateHero(heroForm);
            toast.success('Hero settings updated successfully!');
        } catch (err) {
            toast.error('Failed to update hero settings.');
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await addReview(newReview);
            toast.success('Review added successfully!');
            setNewReview({ quote: '', author: '', role: '', avatar: '' });
        } catch (err) {
            toast.error('Failed to add review.');
        }
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        try {
            await updateReview(editingReview._id, editingReview);
            toast.success('Review updated successfully!');
            setEditingReview(null);
        } catch (err) {
            toast.error('Failed to update review.');
        }
    };

    // Image Handlers
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const uploadPromises = files.map(file => {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('serviceId', selectedService.id);
                formData.append('caption', 'New Upload');
                return addGalleryImage(formData);
            });

            try {
                await Promise.all(uploadPromises);
                toast.success(`${files.length} image(s) uploaded successfully!`);
                e.target.value = null; // Reset input
            } catch (err) {
                toast.error('Failed to upload some images.');
            }
        }
    };

    const handleUpdateImage = async (e) => {
        e.preventDefault();
        try {
            await updateGalleryImage(editingImage.id, editingImage);
            toast.success('Image updated successfully!');
            setEditingImage(null);
        } catch (err) {
            toast.error('Failed to update image.');
        }
    };

    const filteredImages = selectedService
        ? galleryImages.filter(img => img.serviceId === selectedService.id)
        : [];

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button onClick={() => navigate('/')} className="back-btn">Back to Site</button>
            </div>

            <div className="admin-tabs">
                <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => { setActiveTab('services'); setSelectedService(null); }}>Services</button>
                <button className={`tab-btn ${activeTab === 'work' ? 'active' : ''}`} onClick={() => setActiveTab('work')}>Work</button>
                <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
                <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
            </div>

            <div className="admin-content">
                {activeTab === 'services' && !selectedService && (
                    <div className="tab-pane">
                        <h2>Manage Services</h2>
                        <form onSubmit={handleAddService} className="admin-form">
                            <input
                                type="text"
                                placeholder="Service Name"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Tags (e.g. Editorial / Product)"
                                value={newService.tags}
                                onChange={(e) => setNewService({ ...newService, tags: e.target.value })}
                                required
                            />
                            <button type="submit">Add Service</button>
                        </form>

                        <div className="admin-list">
                            {services.map((service, index) => (
                                <div key={index} className="admin-item">
                                    <div>
                                        <strong>{service.name}</strong>
                                        <p>{service.tags}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button onClick={() => setSelectedService(service)} className="view-btn">View Images</button>
                                        <button onClick={() => deleteService(index)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'services' && selectedService && (
                    <div className="tab-pane">
                        <div className="services-header">
                            <div className="pane-header">
                                <button onClick={() => setSelectedService(null)} className="back-btn">&larr; Back to Services</button>
                                <h2>Manage Images: {selectedService.name}</h2>
                            </div>

                            <div className="upload-section">
                                <h3>Add New Image</h3>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                            </div>
                        </div>
                        <div className="admin-grid image-grid">
                            {filteredImages.map((img) => (
                                <div key={img.id} className="admin-card">
                                    <div className="card-img-wrapper">
                                        <img src={img.src} alt={img.caption} />
                                    </div>
                                    <div className="card-actions">
                                        <button onClick={() => setEditingImage(img)}>Edit</button>
                                        <button onClick={() => deleteGalleryImage(img.id)} className="delete-btn">Delete</button>
                                    </div>
                                    <div className="card-info">
                                        <small>{img.caption}</small>
                                    </div>
                                </div>
                            ))}
                            {filteredImages.length === 0 && <p>No images found for this service.</p>}
                        </div>

                        {editingImage && (
                            <div className="modal-overlay open">
                                <div className="modal-content">
                                    <button className="modal-close" onClick={() => setEditingImage(null)}>&times;</button>
                                    <h3>Edit Image Details</h3>
                                    <form onSubmit={handleUpdateImage} className="admin-form">
                                        <div className="preview-img">
                                            <img src={editingImage.src} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                                        </div>

                                        <div className="form-group">
                                            <label>Replace Image:</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append('image', file);
                                                        try {
                                                            const res = await fetch(`${API_URL}/upload`, {
                                                                method: 'POST',
                                                                body: formData
                                                            });
                                                            const data = await res.json();
                                                            setEditingImage({ ...editingImage, src: data.url });
                                                        } catch (err) {
                                                            alert("Failed to upload image");
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Image URL / Base64"
                                            value={editingImage.src}
                                            onChange={(e) => setEditingImage({ ...editingImage, src: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Caption"
                                            value={editingImage.caption}
                                            onChange={(e) => setEditingImage({ ...editingImage, caption: e.target.value })}
                                        />
                                        <button type="submit">Save Changes</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'work' && (
                    <div className="tab-pane">
                        <h2>Manage Work Grid</h2>
                        <div className="admin-grid">
                            {works.map((work, index) => (
                                <div key={work.id} className="admin-card">
                                    <img src={work.img} alt={work.title} />
                                    <div className="card-actions">
                                        <button onClick={() => setEditingWork({ index, data: work })}>Edit</button>
                                    </div>
                                    <div className="card-info">
                                        <p>{work.title}</p>
                                        <small>{work.cat}</small>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {editingWork && (
                            <div className="modal-overlay open">
                                <div className="modal-content">
                                    <button className="modal-close" onClick={() => setEditingWork(null)}>&times;</button>
                                    <h3>Edit Work Item</h3>
                                    <form onSubmit={handleUpdateWork} className="admin-form">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={editingWork.data.title}
                                            onChange={(e) => setEditingWork({ ...editingWork, data: { ...editingWork.data, title: e.target.value } })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Category"
                                            value={editingWork.data.cat}
                                            onChange={(e) => setEditingWork({ ...editingWork, data: { ...editingWork.data, cat: e.target.value } })}
                                        />

                                        <div className="form-group">
                                            <label>Current Image:</label>
                                            <img src={editingWork.data.img} alt="Current" style={{ display: 'block', maxWidth: '100px', marginBottom: '10px' }} />
                                            <label>Upload New Image:</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append('image', file);
                                                        try {
                                                            const res = await fetch(`${API_URL}/upload`, {
                                                                method: 'POST',
                                                                body: formData
                                                            });
                                                            const data = await res.json();
                                                            setEditingWork({
                                                                ...editingWork,
                                                                data: { ...editingWork.data, img: data.url, imgPublicId: data.public_id }
                                                            });
                                                        } catch (err) {
                                                            alert("Failed to upload image");
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Image URL (or upload above)"
                                            value={editingWork.data.img}
                                            onChange={(e) => setEditingWork({ ...editingWork, data: { ...editingWork.data, img: e.target.value } })}
                                        />
                                        <button type="submit">Save Changes</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="tab-pane">
                        <h2>About Page Settings</h2>
                        <form onSubmit={async (e) => { e.preventDefault(); try { await updateAbout(aboutForm); toast.success('About settings updated!'); } catch (err) { toast.error('Failed to update settings.'); } }} className="admin-form">

                            <div className="form-group">
                                <label>Profile Image</label>
                                <div style={{ marginBottom: '10px' }}>
                                    {aboutForm.img && <img src={aboutForm.img} alt="Current" style={{ width: '150px', borderRadius: '8px' }} />}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append('image', file);
                                            try {
                                                const res = await fetch(`${API_URL}/upload`, {
                                                    method: 'POST',
                                                    body: formData
                                                });
                                                const data = await res.json();
                                                setAboutForm({ ...aboutForm, img: data.url, imgPublicId: data.public_id });
                                                toast.success('Image uploaded! Click "Update Image Only" to save.');
                                            } catch (err) {
                                                alert("Failed to upload image");
                                            }
                                        }
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Or Image URL"
                                    value={aboutForm.img}
                                    onChange={(e) => setAboutForm({ ...aboutForm, img: e.target.value })}
                                    style={{ marginTop: '5px' }}
                                />
                                <button
                                    type="button"
                                    className="update-img-btn"
                                    style={{ marginTop: '10px', backgroundColor: '#4a90e2', width: 'auto', padding: '8px 16px' }}
                                    onClick={async () => {
                                        try {
                                            await updateAbout(aboutForm);
                                            toast.success('Profile image updated successfully!');
                                        } catch (err) {
                                            toast.error('Failed to update image.');
                                        }
                                    }}
                                >
                                    Update Image
                                </button>
                            </div>

                            <div className="form-group">
                                <label>Bio Paragraph 1</label>
                                <textarea
                                    value={aboutForm.bio1}
                                    onChange={(e) => setAboutForm({ ...aboutForm, bio1: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Bio Paragraph 2</label>
                                <textarea
                                    value={aboutForm.bio2}
                                    onChange={(e) => setAboutForm({ ...aboutForm, bio2: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Bio Paragraph 3</label>
                                <textarea
                                    value={aboutForm.bio3}
                                    onChange={(e) => setAboutForm({ ...aboutForm, bio3: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Signature Name</label>
                                    <input
                                        type="text"
                                        value={aboutForm.signatureName}
                                        onChange={(e) => setAboutForm({ ...aboutForm, signatureName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Signature Role</label>
                                    <input
                                        type="text"
                                        value={aboutForm.signatureRole}
                                        onChange={(e) => setAboutForm({ ...aboutForm, signatureRole: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Contact Email</label>
                                <input
                                    type="email"
                                    value={aboutForm.email}
                                    onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Instagram Handle</label>
                                <input
                                    type="text"
                                    value={aboutForm.instagram}
                                    onChange={(e) => setAboutForm({ ...aboutForm, instagram: e.target.value })}
                                />
                            </div>

                            <button type="submit">Save About Settings</button>
                        </form>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="tab-pane">
                        <h2>Manage Reviews</h2>
                        <form onSubmit={handleAddReview} className="admin-form">
                            <textarea
                                placeholder="Review"
                                value={newReview.quote}
                                onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                                required
                                rows="5"
                                style={{ width: '100%' }}
                            />
                            <div className="form-group-row">
                                <input
                                    type="text"
                                    placeholder="Author Name"
                                    value={newReview.author}
                                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Place"
                                    value={newReview.role}
                                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Avatar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append('image', file);
                                            try {
                                                const res = await fetch(`${API_URL}/upload`, {
                                                    method: 'POST',
                                                    body: formData
                                                });
                                                const data = await res.json();
                                                setNewReview({ ...newReview, avatar: data.url, avatarPublicId: data.public_id });
                                            } catch (err) {
                                                alert("Failed to upload image");
                                            }
                                        }
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={newReview.avatar}
                                    onChange={(e) => setNewReview({ ...newReview, avatar: e.target.value })}
                                    style={{ marginTop: '5px' }}
                                />
                            </div>
                            <button type="submit">Add Review</button>
                        </form>

                        <div className="admin-list">
                            {reviews.map((review, index) => (
                                <div key={review._id || index} className="admin-item">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                        {/* Avatar in List */}
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: review.avatar ? `url(${review.avatar}) center/cover` : '#f0f0f0',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {!review.avatar && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#999" width="60%" height="60%">
                                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <strong>{review.author}</strong>
                                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{review.role}</p>
                                            <p>"{review.quote}"</p>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button onClick={() => setEditingReview(review)} className="view-btn">Edit</button>
                                        <button onClick={() => deleteReview(review._id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {editingReview && (
                            <div className="modal-overlay open">
                                <div className="modal-content">
                                    <button className="modal-close" onClick={() => setEditingReview(null)}>&times;</button>
                                    <h3>Edit Review</h3>
                                    <form onSubmit={handleUpdateReview} className="admin-form">
                                        <textarea
                                            value={editingReview.quote}
                                            onChange={(e) => setEditingReview({ ...editingReview, quote: e.target.value })}
                                            rows="5"
                                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
                                        />
                                        <div className="form-group-row">
                                            <input
                                                type="text"
                                                value={editingReview.author}
                                                onChange={(e) => setEditingReview({ ...editingReview, author: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                value={editingReview.role}
                                                onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Avatar</label>
                                            {editingReview.avatar && <img src={editingReview.avatar} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append('image', file);
                                                        try {
                                                            const res = await fetch(`${API_URL}/upload`, {
                                                                method: 'POST',
                                                                body: formData
                                                            });
                                                            const data = await res.json();
                                                            setEditingReview({ ...editingReview, avatar: data.url, avatarPublicId: data.public_id });
                                                        } catch (err) {
                                                            alert("Failed to upload image");
                                                        }
                                                    }
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={editingReview.avatar || ''}
                                                onChange={(e) => setEditingReview({ ...editingReview, avatar: e.target.value })}
                                                style={{ marginTop: '5px' }}
                                            />
                                        </div>
                                        <button type="submit">Save Changes</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'general' && (
                    <div className="tab-pane">
                        <h2>General Settings</h2>
                        <form onSubmit={handleUpdateHero} className="admin-form">
                            <h3>Main Tagline</h3>
                            <div className="form-group">
                                <label>Title Line 1</label>
                                <input
                                    type="text"
                                    value={heroForm.title1}
                                    onChange={(e) => setHeroForm({ ...heroForm, title1: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Title Line 2</label>
                                <input
                                    type="text"
                                    value={heroForm.title2}
                                    onChange={(e) => setHeroForm({ ...heroForm, title2: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Subtitle Line 1</label>
                                <input
                                    type="text"
                                    value={heroForm.subtitle1}
                                    onChange={(e) => setHeroForm({ ...heroForm, subtitle1: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Subtitle Line 2</label>
                                <input
                                    type="text"
                                    value={heroForm.subtitle2}
                                    onChange={(e) => setHeroForm({ ...heroForm, subtitle2: e.target.value })}
                                />
                            </div>
                            <button type="submit">Save Settings</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
