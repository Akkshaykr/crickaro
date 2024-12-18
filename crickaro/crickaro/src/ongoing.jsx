import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import './Ongoing.css';

const Ongoing = () => {
    const { district } = useParams(); // Get the district from URL parameters
    const [tournaments, setTournaments] = useState([]); // State to hold tournament data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error message state

    useEffect(() => {
        const fetchOngoingTournaments = async () => {
            setLoading(true);
            setError('');
            try {
                const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                console.log(today);
                const response = await axios.get(`${import.meta.env.VITE_SERVER_APP_URL}/api/images?district=${district}&tournamentType=All`);

                // Filter to show only tournaments that start today
                const ongoingTournaments = response.data.filter((tournament) => {
                    console.log(response.data);
                    const tournamentStartDate = new Date(tournament.startDate).toISOString().split('T')[0];
                    //print(tournamentStartDate);
                    return tournamentStartDate === today;
                });

                setTournaments(ongoingTournaments);
            } catch (err) {
                console.error('Error fetching ongoing tournaments:', err);
                setError('Failed to load ongoing tournaments. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOngoingTournaments(); // Fetch tournaments on component mount
    }, [district]);

    return (
        <div className="ongoing-page">
            <h1>Ongoing Tournaments in {district}</h1>

            {loading ? (
                <p>Loading ongoing tournaments...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : tournaments.length > 0 ? (
                <div className="tournament-list">
                    {tournaments.map((tournament, index) => (
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
                            <p>Status: Ongoing</p>
                            <p>Date: {new Date(tournament.startDate).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No ongoing tournaments found for today.</p>
            )}
        </div>
    );
};

export default Ongoing;
