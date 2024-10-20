import './App.css';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ShelterBreederSignup from './components/Signup/ShelterBreederSignup';
import CustomerSignup from './components/Signup/CustomerSignup';
import MyAccount from './components/Dashboard/MyAccount';
import Inbox  from './components/Dashboard/Inbox';
import ManageListings from './components/Dashboard/ManageListings';
import PostDogPage from './components/Dashboard/postDog';
import ExplorePage from './components/Explore/ExplorePage';
import DogInfo from './components/Explore/DogInfo';
import AdoptionApplication from './components/Adopt/AdoptionApplication';
import Messages from './components/Dashboard/Messages';
import ApplicationDetails from './components/Applications/ApplicationDetails';
import MatchPage from './components/Match/MatchPage';
import Matched from './components/Match/Matched';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);

  useEffect(() => {
    console.log('isLoggedIn state changed:', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const businessAccount = JSON.parse(localStorage.getItem('isBusinessAccount') || 'false');
  setIsLoggedIn(loggedIn);
  setIsBusinessAccount(businessAccount);
  }, []);

  const handleLogin = (userId, isBusiness = false) => {
    setIsLoggedIn(true);
    setIsBusinessAccount(isBusiness);
    localStorage.setItem('isLoggedIn', 'true'); // Save login state to local storage
    localStorage.setItem('isBusinessAccount', JSON.stringify(isBusiness));  
    localStorage.setItem('userId', userId);
    console.log('userID in App.js:', userId);
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await fetch('http://localhost:8000/logout/', {
        method: 'POST',
        credentials: 'include', 
      });
      // Update local state and localStorage after successful logout
      setIsLoggedIn(false);
      setIsBusinessAccount(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isBusinessAccount');
      localStorage.removeItem('userId')
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Router>
       <Header 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout} 
        isBusinessAccount={isBusinessAccount} 
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/customer" element={<CustomerSignup />} />
        <Route path="/signup/shelter-breeder" element={<ShelterBreederSignup />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/manage-listings" element={<ManageListings />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/manage-listings/post" element={<PostDogPage />} />
        <Route path="/dog/:id" element={<DogInfo />} />
        <Route path="/adopt/:id" element={<AdoptionApplication />} />
        <Route path="/messages/:receiverID" element={<Messages />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />
        <Route path="/match-with-a-dog" element={<MatchPage />} />
        <Route path="/matched" element={<Matched />} />
      </Routes>
    </Router>
  );
};

export default App;
