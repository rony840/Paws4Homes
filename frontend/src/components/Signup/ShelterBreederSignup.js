import './ShelterBreederSignup.css';
import React, { useState } from 'react';
import paw from '../../assets/img/PawIconColor.png';
import { useNavigate } from 'react-router-dom';

const ShelterBreederSignup = () => {

    const navigate = useNavigate();
    const [popup, setPopup] = useState({ message: '', type: '' });

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
    
        const formData = new FormData(event.target);
        let formOutput = {}; // Initialize an object to hold the form output
    
        for (const [key, value] of formData.entries()) {
            formOutput[key] = value;
        }
    
        try {
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include CSRF token as needed
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            const data = await response.json();
            
            if (response.ok) {
                setPopup({ message: 'User created successfully!', type: 'success' });
            } else {
                setPopup({ message: data.error, type: 'error' });
            }
        } catch (error) {
            setPopup({ message: 'Network error: Could not connect to server.', type: 'error' });
        }
    };

    const PopupMessage = ({ message, type, onClose }) => {
        const messageClass = type === 'success' ? 'popup-success' : 'popup-error';
    
        return (
            <div className={`popup-message ${messageClass}`}>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        );
    };
    
    
    
    return (
        <div className="signup-container">
            {popup.message && (
            <PopupMessage
                message={popup.message}
                type={popup.type}
                onClose={() => {
                    setPopup({ message: '', type: '' });
                    if (popup.type === 'success') {
                    navigate('/login'); 
                    }
                }}
            />
            )}
            <div className="white-rectangle">
                <div className="colored-rectangle">
                    <div className="signup-heading-text">Signup</div>
                    <div className="description-text">
                        Create an account to be one step closer <br/>to share your dogs to the world!
                    </div>
                    <div className="additional-rectangle">
                        <div className="quote-text">
                            “Dogs are not our whole life, but they make our lives whole.” —Roger Caras
                        </div>
                    </div>
                    <img src={paw} alt="Paw Icon" className="paw-pic" />
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-field">
                            <label htmlFor="companyNameOrFullName" className="name-label">Company Name or Your Full Name</label>
                            <input type="text" id="companyNameOrFullName" name="companyNameOrFullName" className="form-input" placeholder="Humane Animal Shelter Inc." />
                        </div>
                        <div className="form-field-group">
                            <div className="form-field email-field">
                                <label htmlFor="email" className="email-label">Email</label>
                                 <input type="email" id="email" name="email" className="email" placeholder="john@gmail.com" />
                            </div>
                            <div className="form-field phone-field">
                                <label htmlFor="phone" className="phone-label">Phone Number</label>
                                <input type="tel" id="phone" name="phone" className="phone" placeholder="+84 988 888 888" />
                            </div>
                        </div>
                        <div className="form-field-group">
                            <div className="form-field password-field">
                                <label htmlFor="password" className="password-label">Password</label>
                                <input type="password" id="password" name="password" className="password" placeholder="Enter your password" />
                            </div>
                            <div className="form-field password-field">
                                <label htmlFor="rePassword" className="repassword-label">Re-enter Password</label>
                                <input type="password" id="rePassword" name="rePassword" className="repassword" placeholder="Re-enter your password" />
                            </div>
                        </div>
                        <button type="submit" className="create-account-button">
                            <span className="signup-button-text">Create Account</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShelterBreederSignup;