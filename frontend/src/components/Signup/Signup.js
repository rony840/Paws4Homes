import React from 'react';

import { useNavigate } from 'react-router-dom';
import './Signup.css';
import peekingDog from '../../assets/img/peekingDog.png';

const Signup = () => {
  const navigate = useNavigate();

  const handleCustomerAccountClick = () => {
    navigate('/signup/customer');
  };

  const handleShelterBreederAccountClick = () => {
    navigate('/signup/shelter-breeder');
  };
    return (
        <div className="signup-container">
            <div className="white-rectangle">
            <img src={peekingDog} alt="Peeking Dog" className="peeking-dog" />
                <div className="signup-rectangle">
                    <div className="account-type-text">Do you want to make a?</div>
                    <div className="vertical-line"></div>
                    <div className="horizontal-line"></div>
                    <div className="shelter-breeder-button" onClick={handleShelterBreederAccountClick}>
                    <div className="button-text">Shelter/Breeder Account</div>
                </div>
                <div className="customer-account-button" onClick={handleCustomerAccountClick}>
                    <div className="button-text">Customer Account</div>
                </div>
                    <div className="shelter-text">Choose this if you want to <br/>post dogs for adoption</div>
                    <div className="adopt-text">Choose this if you want to <br/>adopt a dog</div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
