import './Inbox.css';
import { useParams, useNavigate } from 'react-router-dom';
import './Messages.css';
import React, { useState, useEffect, useRef } from 'react';

const MessagesPage = () => {
 
const [userProfilePic, setUserProfilePic] = useState('');
const [messages, setMessages] = useState([]);
const [inputValue, setInputValue] = useState('');
const messagesEndRef = useRef(null);
const { receiverID } = useParams();
const loggedInUserId = localStorage.getItem('userId');
console.log("Logged in user ID:", loggedInUserId);
const [userData, setUserData] = useState({}); // Initialize as an empty object
const [isLoading, setIsLoading] = useState(true);
const navigate = useNavigate();


const MAX_CHAR_LIMIT = 150;
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      if (inputValue.length <= MAX_CHAR_LIMIT) {
        await sendMessage(receiverID, inputValue);  // Pass receiverID and inputValue to sendMessage
        setInputValue('');
      } else {
        alert("Message exceeds the character limit.");
      }
    }
  };

  function processMessageContent(message) {
    // Define the pattern of the server-sent message
    const applicationMessagePattern = /New adoption application from .* for .*\. Click here to view: (http:\/\/localhost:3000\/applications\/\d+)/;
  
    // Check if the message matches the pattern
    if (applicationMessagePattern.test(message.content)) {
      // Replace the URL part with an anchor tag
      return message.content.replace(applicationMessagePattern, (match, url) => {
        return `New adoption application from ${message.sender_name} for ${message.dog_name}. <a href='${url}' target="_blank">Click here to view the application.</a>`;
      });
    }
  
    // For all other messages, return as-is
    return message.content;
  }
  
  

      const fetchMessages = async () => {
        if (!receiverID) return;
    
        try {
          const response = await fetch(`http://localhost:8000/get_messages/${receiverID}/`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const messagesData = await response.json();
          setMessages(messagesData);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      const sendMessage = async (receiverID, messageContent) => {
        // Make sure messageContent is the actual message text
        const payload = JSON.stringify({ receiver: receiverID, content: messageContent });
        console.log('Sending payload:', payload);  // This should now include both receiver and content
      
        try {
          const response = await fetch('http://localhost:8000/send_message/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: payload,
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          // Handle the response
          await fetchMessages();
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };
      
      useEffect(() => {
        fetchMessages();
      }, [receiverID]);

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
            setIsLoading(false);
            setUserProfilePic(userData.profile_image);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        };
      
        if (loggedInUserId) {
          fetchUserProfile();
        }
      }, [loggedInUserId]);


      useEffect(() => {
        const markMessagesAsRead = async () => {
            // Send request to mark messages as read
            await fetch(`http://localhost:8000/mark_messages_as_read/${receiverID}/`, {
                method: 'POST',
                credentials: 'include',
            });
        };
    
        if (receiverID) {
            markMessagesAsRead();
        }
    }, [receiverID]);


    const handleEditProfileClick = () => {
      navigate('/my-account');
    };

  return (
    <div className="inbox-container">
       {isLoading ? (
      <div>Loading...</div> // Display loading indicator while fetching data
    ) : (
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
        <div className="chat-box">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="messages-container">
  {[...messages].reverse().map((message, index) => (
    <div 
    key={index} 
    className={`message-rectangle ${message.sender_id === parseInt(loggedInUserId, 10) ? '' : 'message-rectangle-other'}`}
  >
    {/* Render the logged-in user's profile image for messages sent by them */}
    {message.sender_id === parseInt(loggedInUserId, 10) && (
      <img src={userProfilePic} alt="Profile" className="user-profile-image" />
    )}

    {/* Render the receiver's profile image for messages received */}
    {message.sender_id !== parseInt(loggedInUserId, 10) && (
      <img src={message.receiver_profile_pic} alt="Receiver Profile" className="receiver-profile-image" />
    )}

<div className="message-text">
        {/* Add 'You:' or 'Them:' based on the sender */}
        <span>{message.sender_id === parseInt(loggedInUserId, 10) ? 'You: ' : 'Them: '}</span>

        {/* Use dangerouslySetInnerHTML for the message content */}
        <span dangerouslySetInnerHTML={{ __html: processMessageContent(message) }} />
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>

        </div>
      </div>
      )}
    </div>
  );
};

export default MessagesPage;

