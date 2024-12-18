// DistrictPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DistrictPage.css';
import dist from './assets/district.webp';

const DistrictPage = () => {
    const [districts, setDistricts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_APP_URL}/api/districts`);
                if (response.status === 200) {
                    setDistricts(response.data);
                }
            } catch (error) {
                console.error("Error fetching districts:", error.message);
            }
        };
        fetchDistricts();
    }, []);

    const handleDistrictClick = (district) => {
        navigate(`/tournament/${district}`); // Navigate to TournamentPage with the selected district
    };

    const filteredDistricts = districts.filter((district) =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="district-page">
            <div className="left-container">
                <img src={dist} alt="Tamil Nadu Map" className="left-image" />
            </div>
            <div className="right-container">
                <h1>Select Your District</h1>
                <input
                    type="text"
                    placeholder="Search district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <div className="district-cards">
                    {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((district, index) => (
                            <div
                                key={index}
                                className="district-card"
                                onClick={() => handleDistrictClick(district)}
                            >
                                <h2>{district}</h2>
                            </div>
                        ))
                    ) : (
                        <p>No districts found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DistrictPage;
