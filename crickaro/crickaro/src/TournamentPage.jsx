import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TournamentPage.css';

const TournamentPage = () => {
    const { district } = useParams();
    const navigate = useNavigate();
    const [tournamentType, setTournamentType] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchImages = useCallback(async () => {
        if (tournamentType) {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_APP_URL}/api/images?district=${district}&tournamentType=${tournamentType}`
                );

                const today = new Date().toISOString().split('T')[0];
                const filteredImages = response.data.filter((image) => {
                    const tournamentDate = new Date(image.startDate).toISOString().split('T')[0];
                    if (tournamentType === 'Ongoing Tournament') {
                        return tournamentDate === today;
                    } else if (tournamentType === 'Upcoming Tournament') {
                        return tournamentDate > today;
                    }
                    return true;
                });

                if (filteredImages.length === 0) {
                    setError(`No images available for the selected tournament type in ${district}.`);
                }
                setImages(filteredImages);
            } catch (error) {
                console.error('Error fetching images:', error);
                setError('Failed to load images. Please check if the server is running and try again.');
            } finally {
                setLoading(false);
            }
        }
    }, [district, tournamentType]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleTournamentTypeClick = (type) => {
        setTournamentType(type);
        if (type === 'Past Tournament') {
            navigate(`/past/${district}`);
        } else if (type === 'Ongoing Tournament') {
            navigate(`/ongoing/${district}`);
        } else if (type === 'Upcoming Tournament') {
            navigate(`/upcoming/${district}`);
        }
    };

    return (
        <div className="tournament-page">
            <h1>{district} - Select Tournament Type</h1>
            <div className="tournament-type-buttons">
                {['Past Tournament', 'Ongoing Tournament', 'Upcoming Tournament'].map((type) => (
                    <button 
                        key={type} 
                        onClick={() => handleTournamentTypeClick(type)} 
                        disabled={loading || tournamentType === type}
                        className={tournamentType === type ? 'active' : ''}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading images...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="images">
                    {images.length > 0 ? (
                        <div className="image-list">
                            {images.map((image, index) => (
                                <div key={index} className="image-container">
                                    <img 
                                        src={image.image} 
                                        alt={`Uploaded for ${tournamentType}`} 
                                        onClick={() => window.open(image.image, '_blank')}
                                    />
                                    <p>Tournament Type: {image.tournamentBall}</p>
                                    <p>Status: {image.status}</p>
                                    <p>Date: {new Date(image.startDate).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No images available for the selected tournament type.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TournamentPage;
