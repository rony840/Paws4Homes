import paw from '../../assets/img/PawIconColor.png';
import DisplayPair from '../Applications/DisplayPair';
import './MyAccount.css'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef  } from 'react';

const MyAccountPage = () => {
  const loggedInUserId = localStorage.getItem('userId');
  const [userData, setUserData] = useState({});
  const [userProfilePic, setUserProfilePic] = useState('');
  const navigate = useNavigate();
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const fileInputRef = useRef();
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  

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
        setCompanyName(userData.company_name || '');
        setFirstName(userData.first_name || '');
        setLastName(userData.last_name || '');
        setPhoneNumber(userData.phone_number || '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    if (loggedInUserId) {
      fetchUserProfile();
    }
    const storedValue = localStorage.getItem('isBusinessAccount');
        if (storedValue) {
            setIsBusinessAccount(JSON.parse(storedValue));
        }
  }, [loggedInUserId]);


  const toggleEditMode = () => {
    setIsEditMode(prevMode => !prevMode);
};
const handleSave = async () => {
  const updatedUserData = {
    company_name: companyName,
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
  };
  try {
    const url = `http://localhost:8000/update_user_profile/${loggedInUserId}/`;
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as required
      },
      body: JSON.stringify(updatedUserData),
    });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating user profile:', errorData);
        throw new Error(`Network response was not ok: ${errorData.message}`);
      }

      const result = await response.json();
      console.log('Update successful:', result);
      // Update local state to reflect changes
      setUserData(result);
      setIsEditMode(false); // Exit edit mode after successful update
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  
  const handleChangePassword = async () => {
    if (newPassword !== reNewPassword) {
      alert('Passwords do not match!');
      return;
    }

    // TODO: Add more validations for newPassword if needed

    try {
      const response = await fetch('http://localhost:8000/change_password/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as required, like authentication tokens
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle successful password change
      alert('Password changed successfully. Please log in with your new password.');
      await handleLogout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const handleLogout = async () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isBusinessAccount');
      localStorage.removeItem('userId')
  };

  const handleImageClick = () => {
    console.log('click click')
    fileInputRef.current.click();
  };
  
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Set the selected profile picture file
      setProfilePicture(file);
  
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append('image', file);
  
      try {
        const response = await fetch('http://localhost:8000/upload-profile-picture/', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
  
        // Update the profile picture URL with the newly uploaded image
        setProfilePictureUrl(data.image_url);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };
  



  return (
    <div className="login-container">
      <div className="white-account-rectangle">
        <div className="my-account-rectangle">
          <h2 className="my-account-title">Customize your profile!</h2>
          <div className="my-account-white-circle">
  <img
    src={profilePictureUrl || userProfilePic} // Use the uploaded image URL if available
    alt="Profile"
    className="my-account-image"
    onClick={handleImageClick}
  />
  <input
    type="file"
    accept="image/*"
    style={{ display: 'none' }}
    ref={fileInputRef}
    onChange={handleProfilePicChange}
  />
</div>
<button className="change-pic-button" onClick={handleImageClick}>
  <span className="change-pic-text">Choose New Profile Picture</span>
</button>


          <img src={paw} alt="Paw Icon" className="paw-icon" />
        </div>
        <h2 className="my-account-info">Change your information</h2>
        <h4>Your email is the only thing hat cannot be changed.</h4>
        <button className="edit-button" onClick={toggleEditMode}>
          {isEditMode ? "Undo" : "Edit"}
        </button>

        {isEditMode && (
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        )}
        <div className="my-info-style">
          
        <div className="adoption-input-group">
  {isEditMode ? (
    isBusinessAccount ? (
      <div className="form-field">
        <label htmlFor="companyName" className="repassword-label">Company Name</label>
        <input type="text" id="companyName" className="my-input" value={companyName} onChange={e => setCompanyName(e.target.value)} />
      </div>
    ) : (
      <>
        <div className="form-field">
          <label htmlFor="firstName" className="repassword-label">First Name</label>
          <input type="text" id="firstName" className="my-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="lastName" className="repassword-label">Last Name</label>
          <input type="text" id="lastName" className="my-input" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
      </>
    )
  ) : (
    isBusinessAccount ? (
      <DisplayPair label="Company Name" value={userData.company_name} customValueClass="my-info-display-value" />
    ) : (
      <>
        <DisplayPair label="First Name" value={userData.first_name} customValueClass="my-info-display-value" />
        <DisplayPair label="Last Name" value={userData.last_name} customValueClass="my-info-display-value" />
      </>
    )
  )}
</div>

<div className="adoption-input-group">
  <DisplayPair label="Email" value={userData.email} customValueClass="my-info-display-value" />
  
  {!isEditMode && (
    <DisplayPair label="Phone Number" value={userData.phone_number} customValueClass="my-info-display-value" />
  )}

  {isEditMode && (
    <div className="form-field">
      <label htmlFor="phoneNumber" className="repassword-label">Phone Number</label>
      <input type="text" id="phoneNumber" className="my-input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
    </div>
  )}
</div>

            <h3 className="change-password">Change your password</h3>

            <div className="my-account-field-group">
            <div className="my-form-field password-field">
        <label htmlFor="rePassword" className="repassword-label">Enter Password</label>
        <input type="password" id="password" className="my-input" placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
    <div className="my-form-field password-field">
        <label htmlFor="rePassword" className="repassword-label">Re-enter Password</label>
        <input type="password" id="rePassword" className="my-input" placeholder="Re-enter your new password" value={reNewPassword} onChange={(e) => setReNewPassword(e.target.value)} />
      </div>
</div>

<button className="change-pass-button" onClick={handleChangePassword}>Change Password</button>
    </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
