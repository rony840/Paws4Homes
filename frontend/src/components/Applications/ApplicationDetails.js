import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import DogCard from '../Explore/DogCard';
import paw from '../../assets/img/PawIconColor.png';
import './ApplicationDetails.css'
import DisplayPair from './DisplayPair';

const ApplicationDetails = () => {
  const { id } = useParams(); // Get the application ID from the URL
  const [application, setApplication] = useState(null);
  const loggedInUserId = localStorage.getItem('userId');
  const navigate = useNavigate();
  console.log('Logged in userID in app details: ', loggedInUserId);

  const handleAccept = async () => {
  
    const contactInfo = `Email: ${application.owner_contact_info.email}, Phone: ${application.owner_contact_info.phone_number}`;
    const messageContent = `Your application for ${dogDetails.name} has been accepted! Please contact us at ${contactInfo} to arrange a meeting for picking up the dog.`;
  
    await sendMessage(application.applicant_id, messageContent);
    navigate(`/messages/${application.applicant_id}`); 
  };

  const handleDeny = async () => {

    const messageContent = `We are sorry to inform you that your application for ${dogDetails.name} has been declined.`;
    await sendMessage(application.applicant_id, messageContent);
    navigate(`/messages/${application.applicant_id}`); 
  };
  const handleChat = () => {
    if (isCurrentUserOwner) {
      navigate(`/messages/${application.applicant_id}`); 
    } else {
      navigate(`/messages/${dogDetails.user_id}`); 
    }
  };

  const sendMessage = async (receiverId, content) => {
    try {
      const response = await fetch('http://localhost:8000/send_message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiver: receiverId, content }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`http://localhost:8000/applications/${id}`, {
          method: 'GET',
          credentials: 'include', 
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setApplication(data);
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };
  
    fetchApplication();
  }, [id]);
  

  if (!application) {
    return <div>Loading...</div>;
  }
  const dogDetails = application.dog;
  const isCurrentUserOwner = loggedInUserId === dogDetails.user_id.toString();

  console.log('is current user the owner: ',isCurrentUserOwner);
  console.log('user id in dogDetails: ', dogDetails.user_id);

  return (
        <div className="signup-container">
            <div className="white-rectangle">
                <div className="application-rectangle">
                    <div className="application-heading-text">Adoption Application</div>
                    <div className="application-text">
                    {application.first_name} {application.last_name} submitted this application to adopt {dogDetails.name}! 
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
                    <DisplayPair label="First Name" value={application.first_name} />
                    <DisplayPair label="Last Name" value={application.last_name} />
                  </div>
  
          <div className="adoption-input-group">
          <DisplayPair label="Email" value={application.email} />
                    <DisplayPair label="Phone Number" value={application.phone_number} />
                  </div>
  
      <div className="adoption-input-group">
      <DisplayPair label="Reasons for wanting to adopt:" value={application.why_adopt} isLongText={true} />
                  </div>
  
      <div className="adoption-input-group">
      <DisplayPair label="On average, how many hours will the dog be home alone?" value={application.alone_time} />
      <DisplayPair label="Hose type:" value={application.house_type} />
                    </div>
  
      <div className="adoption-input-group">
      <DisplayPair label="Owns a home:" value={application.home_owner} />
                    <DisplayPair label="Had dogs before:" value={application.owned_dog_before} />
                  </div>
  
      <div className="adoption-input-group">
      <DisplayPair label="Additional Note" value={application.additional_note} isLongText={true} />
                  </div>
  </div>
            {isCurrentUserOwner && (
            <div className="application-actions">
                <button className="accept-button" onClick={handleAccept}>Accept Application</button>
                <button className="deny-button" onClick={handleDeny}>Deny Application</button>
                <button className="chat-button" onClick={handleChat}>Chat With Customer</button>
            </div>
            )}
            {!isCurrentUserOwner && (
            <div className="solo-application-actions">
                <button className="chat-button" onClick={handleChat}>Chat with Shelter/Breeder</button>
            </div>
            )}
                </div>
            </div>
    );
  };


export default ApplicationDetails;
