import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import './upcoming.css';

const UpcomingTournaments = () => {
    const { district } = useParams(); // Get the district from URL parameters
    const [upcomingTournaments, setUpcomingTournaments] = useState([]); // State to hold upcoming tournaments
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error message state

    useEffect(() => {
        const fetchUpcomingTournaments = async () => {
            setLoading(true);
            setError('');
            try {
                const today = new Date(); // Get today's date

                const response = await axios.get(`${import.meta.env.VITE_SERVER_APP_URL}/api/images?district=${district}&tournamentType=All`);

                // Filter to show only tournaments starting after today
                const filteredTournaments = response.data.filter((tournament) => {
                    const tournamentStartDate = new Date(tournament.startDate);
                    return tournamentStartDate > today; // Check if start date is in the future
                });

                setUpcomingTournaments(filteredTournaments);
            } catch (err) {
                console.error('Error fetching upcoming tournaments:', err);
                setError('Failed to load upcoming tournaments. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingTournaments(); // Fetch tournaments on component mount
    }, [district]);

    return (
        <div className="upcoming-page">
            <h1>Upcoming Tournaments in {district}</h1>

            {loading ? (
                <p>Loading upcoming tournaments...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : upcomingTournaments.length > 0 ? (
                <div className="tournament-list scrollable-container">
                    {upcomingTournaments.map((tournament, index) => (
                        <div key={index} className="tournament-item">
                            <h2>{tournament.teamName}</h2>
                            <Zoom>
                                <img
                                    src={tournament.image}
                                    alt={`Tournament ${tournament.teamName}`}
                                    className="tournament-image"
                                />
                            </Zoom>
                            <p>Ball Type: {tournament.tournamentBall}</p>
                            <p>Status: Upcoming</p>
                            <p>Date: {new Date(tournament.startDate).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No upcoming tournaments found.</p>
            )}
        </div>
    );
};

export default UpcomingTournaments;
