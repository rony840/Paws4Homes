import { useParams, useLocation } from 'react-router-dom';
import paw from '../../assets/img/PawIconColor.png';
import React, { useState, useEffect  } from 'react';
import './AdoptionApplication.css';
import DogCard from '../Explore/DogCard';
import InputPair from '../Dashboard/InputPair';

const AdoptionApplication = () => {
  const { id } = useParams(); // Get dog ID from URL
  const location = useLocation();
  const dogDetails = location.state.dogDetails;
  console.log(dogDetails)

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [whyAdopt, setWhyAdopt] = useState('');
  const [aloneTime, setAloneTime] = useState('');
  const [houseType, setHouseType] = useState('');
  const [homeOwner, setHomeOwner] = useState('');
  const [dogOwner, setDogOwner] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/get-user-details/', {
        method: 'GET',
        credentials: 'include',  
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setPhoneNumber(data.phone_number);
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
    });
}, []);

const handleSubmit = async (event) => {
  event.preventDefault(); 


  const formData = {
    dogID: id,
    firstName,
    lastName,
    email,
    phone,
    whyAdopt, 
    aloneTime, 
    houseType, 
    homeOwner, 
    dogOwner, 
    additionalNote 
};
  console.log(formData)

  try {
      const response = await fetch('http://localhost:8000/create-adoption-application/', {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              
          },
          body: JSON.stringify(formData)
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      
  } catch (error) {
      console.error('Error submitting form:', error);
     
  }
};


  return (
      <div className="signup-container">
          <div className="white-rectangle">
              <div className="application-rectangle">
                  <div className="application-heading-text">Adoption Application</div>
                  <div className="application-text">
                  You are one step closer to adopting {dogDetails.name} 
                  </div>
                  <img src={paw} alt="Paw Icon" className="paw-pic" />
                  <div className="adop-dog-card"> 
                  <DogCard 
                    image={dogDetails.images[0]}
                    name={dogDetails.name}
                    age={dogDetails.age}
                    breed={dogDetails.breed}
                  />
                </div>
              </div>
              <div className="adoption-form-style">
              <div className="adoption-input-group">
                    <InputPair label="First Name" id="firstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <InputPair label="Last Name" id="lastName" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

        <div className="adoption-input-group">
                    <InputPair label="Email" id="email" placeholder="john@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputPair label="Phone Number" id="phone" placeholder="+84 988 888 888" value={phone} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>

    <div className="adoption-input-group">
          <InputPair label="Why do you want to bring a new pet into your home?" id="why" placeholder="Your reason" isTextArea={true} value={whyAdopt} onChange={(e) => setWhyAdopt(e.target.value)} />
                </div>

    <div className="adoption-input-group">
            <InputPair label="On average, how many hours will the dog be home alone?" id="aloneTime" inputType="dropdown" options={[{ value: '', label: 'Choose', disabled: true, selected: true },{ value: 'Less than 1 hour', label: 'Less than 1 hour' }, { value: 'Between 1-2 hours', label: 'Between 1-2 hours' }, { value: 'Betwen 2-4 hours', label: 'Between 2-4 hours' }, { value: 'More than 5 hours', label: 'More than 5 hours' }]} value={aloneTime} onChange={(e) => setAloneTime(e.target.value)} />
                    <InputPair label="Do you live in a?" id="houseType" inputType="dropdown" options={[{ value: '', label: 'Choose', disabled: true, selected: true },{ value: 'House', label: 'House' }, { value: 'Apartment', label: 'Apartment' }, { value: 'Other', label: 'Other' }]} value={houseType} onChange={(e) => setHouseType(e.target.value)} />
                </div>

    <div className="adoption-input-group">
    <InputPair label="Do you own your home?" id="homeOwner" inputType="dropdown" options={[{ value: '', label: 'Choose', disabled: true, selected: true },{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} value={homeOwner} onChange={(e) => setHomeOwner(e.target.value)} />
                    <InputPair label="Have you owned a dog before?" id="dogOwner" inputType="dropdown" options={[{ value: '', label: 'Choose', disabled: true, selected: true },{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} value={dogOwner} onChange={(e) => setDogOwner(e.target.value)} />
                </div>

    <div className="adoption-input-group">
    <InputPair label="Add a note (optional)" id="note" placeholder="Any additional information" isTextArea={true} value={additionalNote} onChange={(e) => setAdditionalNote(e.target.value)} />
                </div>
</div>
<button type="submit" className="adoption-button" onClick={handleSubmit}>
    <span className="adoption-button-text">Submit Application</span>
</button>
              </div>
          </div>
  );
};
export default AdoptionApplication;


