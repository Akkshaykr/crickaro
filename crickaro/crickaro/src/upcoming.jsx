import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingTournaments = ({ district }) => {
    const [upcomingTournaments, setUpcomingTournaments] = useState([]);
    const [error, setError] = useState('');

    const fetchUpcomingTournaments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tournaments', {
                params: { district, tournamentStatus: 'Upcoming' },
            });

            const today = new Date();

            const filteredTournaments = response.data.filter(tournament => {
                const startDate = new Date(tournament.startDate);
                
                // Check if startDate is valid and filter by upcoming date
                if (isNaN(startDate.getTime())) {
                    console.warn('Invalid start date:', tournament.startDate);
                    return false;
                }
                
                return startDate > today; // Only show tournaments with future start dates
            });

            setUpcomingTournaments(filteredTournaments);
            setError(''); // Clear error state on successful fetch
        } catch (error) {
            console.error('Error fetching upcoming tournaments:', error);
            setError('Failed to fetch upcoming tournaments.');
        }
    };

    useEffect(() => {
        if (district) {
            fetchUpcomingTournaments();
        }
    }, [district]);

    return (
        <div>
            <h2>Upcoming Tournaments</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {upcomingTournaments.length > 0 ? (
                    upcomingTournaments.map((tournament, index) => (
                        <li key={index}>
                            <p>Team: {tournament.teamname}</p>
                            <p>Date: {new Date(tournament.startDate).toLocaleDateString()}</p>
                        </li>
                    ))
                ) : (
                    <p>No upcoming tournaments found.</p>
                )}
            </ul>
        </div>
    );
};

export default UpcomingTournaments;
