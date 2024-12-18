import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './past.css';

const Past = () => {
    const { district } = useParams();
    const [blogDetails, setBlogDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_APP_URL}/api/blogs?district=${district}`);
                if (response.data && response.data.length > 0) {
                    setBlogDetails(response.data);
                } else {
                    setBlogDetails([]);
                }
            } catch (err) {
                setError('Error fetching blog details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
    }, [district]);

    const handleTeamClick = (team) => {
        setSelectedTeam(team);
    };

    const filteredTeams = blogDetails.filter((blog) =>
        blog.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="past-page">
            <h1 className="title">Past Tournaments - {district}</h1>
            <input
                type="text"
                className="search-bar"
                placeholder="Search team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
                <p className="loading">Loading blog details...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="content-container">
                    <div className="team-list">
                        {filteredTeams.length > 0 ? (
                            filteredTeams.map((blog, index) => (
                                <button
                                    key={index}
                                    className="team-button"
                                    onClick={() => handleTeamClick(blog)}
                                >
                                    {blog.teamName}
                                </button>
                            ))
                        ) : (
                            <p className="no-team-selected">No teams found for your search.</p>
                        )}
                    </div>
                    <div className={`team-details ${selectedTeam ? 'active' : ''}`}>
                        {selectedTeam ? (
                            <div className="details-container">
                                <h2 className="team-name">{selectedTeam.teamName}</h2>
                                <div className="images-container">
                                    {selectedTeam.images && selectedTeam.images.length > 0 ? (
                                        selectedTeam.images.map((image, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={image}
                                                alt={`Team ${selectedTeam.teamName}`}
                                                className="blog-image"
                                            />
                                        ))
                                    ) : (
                                        <p>No images available.</p>
                                    )}
                                </div>
                                <p className="blog-text">{selectedTeam.text}</p>
                            </div>
                        ) : (
                            <p className="no-team-selected">Select a team to view details.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Past;
