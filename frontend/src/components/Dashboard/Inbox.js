import React, { useState, useEffect } from 'react';
import magnifyGlass from '../../assets/img/maginifyingGlass.png';
import './Inbox.css';
import { Link, useNavigate } from 'react-router-dom';


const InboxPage = () => {

  const [messages, setMessages] = useState([]); // State to hold messages
  const loggedInUserId = localStorage.getItem('userId');
  const [userData, setUserData] = useState({});
  const [userProfilePic, setUserProfilePic] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
          const response = await fetch('http://localhost:8000/get_messages/', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
              credentials: 'include', // Include this line if using session-based auth
          });
  
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          const currentUserId = loggedInUserId; // Get current user's ID
  
          // Filter messages to only include those where the current user is the receiver
          const messagesToCurrentUser = data.filter(message => message.receiver_id === parseInt(currentUserId, 10));
          setMessages(messagesToCurrentUser); // Update state with filtered messages
      } catch (error) {
          console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  }, []);

    const latestMessages = messages.reduce((acc, message) => {
      const existingMessage = acc.find(m => m.sender_id === message.sender_id);
      if (!existingMessage || new Date(existingMessage.timestamp) < new Date(message.timestamp)) {
          acc = acc.filter(m => m.sender_id !== message.sender_id); // Remove old message
          acc.push(message); // Add the latest message
      }
      return acc;
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile...');
        const response = await fetch(`http://localhost:8000/user_profile/${loggedInUserId}/`, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const userData = await response.json();
        console.log('User profile data:', userData); // Log the fetched user data
        setUserData(userData);
        setUserProfilePic(userData.profile_image);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    if (loggedInUserId) {
      fetchUserProfile();
    }
  }, [loggedInUserId]);

  const handleEditProfileClick = () => {
    navigate('/my-account');
  };

  return (
    <div className="inbox-container">
      <div className="white-rectangle">
      <div className="inbox-profile-rectangle">
        <div className="inbox-welcome-text">
          Welcome, {userData.is_business_account ? userData.company_name : `${userData.first_name}`}
        </div>
        <div className="white-circle">
        <img src={userProfilePic} alt="Profile" className="circle-image"/>
          </div>
          <div className="email-text">{userData.email}</div>
          <div className="edit-profile-button" onClick={handleEditProfileClick}>
            <div className="edit-profile-text">Edit profile</div>
          </div>
              </div>
              <div className="inbox-rectangle">
              <div className="inbox-search-bar">
                    <input type="text" placeholder="Search inbox" />
                </div>
                <img src={magnifyGlass} alt="Magnify Glass" className="inbox-magnifying-glass"/>

                <div className="small-new-post-button" >
                    <div className="small-new-post-text">New Message</div>
                </div>
                <div className="label-rectangle">
                <div className="label-data-container">
            <div className="listing-label inbox-name">From:</div>
            {latestMessages.map((message, index) => (
        <Link to={`/messages/${message.sender_id}`} key={message.sender_id}>
            <div className={index === 0 ? "inbox-data-first inbox-name" : "inbox-data inbox-name"}>
                {message.sender_name}
            </div>
        </Link>
    ))}
</div>

<div className="label-data-container">
    <div className="listing-label message">Last Message</div>
    {latestMessages.map((message, index) => (
        <Link to={`/messages/${message.sender_id}`} key={message.sender_id}>
            <div className={index === 0 ? "inbox-data-first" : "inbox-data"}>
                {message.content}
            </div>
        </Link>
    ))}
</div>

                </div>
                <div className="line line1"></div>
                <div className="line line2"></div>
                <div className="line line3"></div>
                <div className="line line4"></div>
                <div className="line line5"></div>
                <div className="line line6"></div>
                <div className="line line7"></div>
                <div className="line line8"></div>
              </div>
            </div>
          </div>
  );
};

export default InboxPage;