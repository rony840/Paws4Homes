
import { useNavigate } from 'react-router-dom';
import DogCard from '../Explore/DogCard'; // Import DogCard component
import React, { useState, useEffect } from 'react';

const MatchedPage = () => {
    const navigate = useNavigate();
    const [matchedDog, setMatchedDog] = useState(null);

    useEffect(() => {
        const fetchDogListing = async () => {
            try {
                const response = await fetch('http://localhost:8000/get-dog-listings/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // Assuming the dog with ID 25 is always in the list
                const dog = data.find(d => d.id === 25);
                setMatchedDog(dog);
            } catch (error) {
                console.error('Error fetching dog data:', error);
            }
        };
        fetchDogListing();
    }, []);

    if (!matchedDog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="login-container">
        <div className="white-rectangle">
            <h2>We think {matchedDog.name} is your match!</h2>
            <DogCard
                image={matchedDog.images}
                name={matchedDog.name}
                age={matchedDog.age}
                breed={matchedDog.breed}
            />
            <button onClick={() => navigate('/explore')}>See All Dogs</button>
            </div>
        </div>
    );
};

export default MatchedPage;
