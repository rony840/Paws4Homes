import paw from '../../assets/img/PawIconColor.png';
import cloud from '../../assets/img/dogCloud.png';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import InputPair from '../Dashboard/InputPair';
import './MatchPage.css'

const MatchPage = ({handleLogin} ) => {

    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        activityLevel: '',
        dailyTime: '',
        sizePreference: '',
        otherPets: '',
        preferredAge: '',
        childrenAtHome: '',
        furPreference: '',
        sheddingTolerance: '',
        livingSituation: '',
        lookingFor: '',
      });

      const handleChange = (question, value) => {
        setFormState(prevState => ({
          ...prevState,
          [question]: value
        }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submission:', formState);
      
        try {
          // Call the match_dog endpoint with the formState data
          const response = await fetch('http://localhost:8000/match-dog/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formState),
            credentials: 'include', // If you're using session-based authentication
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Matched Dog:', data.matchedDog);
      
          // Handle the matched dog data here
          // For example, you might want to redirect the user to a page with the dog's details
          // or update the state to display the dog's information on the current page.
      
        } catch (error) {
          console.error('Error submitting form:', error);
          // Handle errors here, such as displaying an error message to the user
        }
      };

      const tempHandleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submission:', formState);
        // Redirect to the matched page
        navigate('/matched'); // Assuming you have 'navigate' from 'react-router-dom'
    };
    

    return (
      <div className="login-container">
        <div className="white-rectangle">
            
        <form onSubmit={handleSubmit}>
      <div className="input-group">
        <InputPair
          label="Activity Level"
          id="activityLevel"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'sedentary', label: 'Sedentary' },
            { value: 'moderately_active', label: 'Moderately Active' },
            { value: 'very_active', label: 'Very Active' }
          ]}
          value={formState.activityLevel}
          onChange={(e) => handleChange('activityLevel', e.target.value)}
        />
        <InputPair
          label="Daily Time for the Dog"
          id="dailyTime"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'less_than_one', label: 'Less than 1 hour' },
            { value: 'one_to_three', label: '1-3 hours' },
            { value: 'more_than_three', label: 'More than 3 hours' }
          ]}
          value={formState.dailyTime}
          onChange={(e) => handleChange('dailyTime', e.target.value)}
        />
      </div>

      <div className="input-group">
        <InputPair
          label="Preferred Dog Size"
          id="sizePreference"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'no_preference', label: 'No Preference' }
          ]}
          value={formState.sizePreference}
          onChange={(e) => handleChange('sizePreference', e.target.value)}
        />
        <InputPair
          label="Other Pets at Home"
          id="otherPets"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'none', label: 'None' },
            { value: 'cats', label: 'Cats' },
            { value: 'other_dogs', label: 'Other Dogs' },
            { value: 'small_pets', label: 'Small Pets' }
          ]}
          value={formState.otherPets}
          onChange={(e) => handleChange('otherPets', e.target.value)}
        />
      </div>

      <div className="input-group">
        <InputPair
          label="Preferred Dog Age"
          id="preferredAge"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'puppy', label: 'Puppy' },
            { value: 'young_adult', label: 'Young Adult' },
            { value: 'adult', label: 'Adult' },
            { value: 'senior', label: 'Senior' }
          ]}
          value={formState.preferredAge}
          onChange={(e) => handleChange('preferredAge', e.target.value)}
        />
        <InputPair
          label="Children at Home"
          id="childrenAtHome"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
          value={formState.childrenAtHome}
          onChange={(e) => handleChange('childrenAtHome', e.target.value)}
        />
      </div>

      <div className="input-group">
        <InputPair
          label="Fur Preference"
          id="furPreference"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'short_hair', label: 'Short Hair' },
            { value: 'long_hair', label: 'Long Hair' },
            { value: 'hypoallergenic', label: 'Hypoallergenic' }
          ]}
          value={formState.furPreference}
          onChange={(e) => handleChange('furPreference', e.target.value)}
        />
        <InputPair
          label="Shedding Tolerance"
          id="sheddingTolerance"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'none', label: 'None' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'a_lot', label: 'A lot' }
          ]}
          value={formState.sheddingTolerance}
          onChange={(e) => handleChange('sheddingTolerance', e.target.value)}
        />
      </div>

      <div className="input-group">
        <InputPair
          label="Living Situation"
          id="livingSituation"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'apartment', label: 'Apartment' },
            { value: 'house_with_yard', label: 'House with Yard' },
            { value: 'farm_rural', label: 'Farm/Rural Area' }
          ]}
          value={formState.livingSituation}
          onChange={(e) => handleChange('livingSituation', e.target.value)}
        />
        <InputPair
          label="Looking for a Dog for"
          id="lookingFor"
          inputType="dropdown"
          options={[
            { value: '', label: 'Choose', disabled: true, selected: true },
            { value: 'guarding', label: 'Guarding' },
            { value: 'companionship', label: 'Companionship' },
            { value: 'working', label: 'Working' }
          ]}
          value={formState.lookingFor}
          onChange={(e) => handleChange('lookingFor', e.target.value)}
        />
      </div>

      {/* Add a submit button */}
      <button className="match-button" onClick={tempHandleSubmit}>
            Find My Match
            </button>
    </form>
        </div>
      </div>
    );
};

export default MatchPage;
