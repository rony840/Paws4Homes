import React, { useEffect, useState } from 'react';
import './ManageListings.css';
import { useNavigate  } from 'react-router-dom';
import magnifyGlass from '../../assets/img/maginifyingGlass.png';

const ManageListingsPage = () => {
  const navigate = useNavigate();

  const [userDogListings, setUserDogListings] = useState([]);
  const [userData, setUserData] = useState({});
  const [userProfilePic, setUserProfilePic] = useState('');
  const loggedInUserId = localStorage.getItem('userId');

  const navigateToPostDog = () => {
    navigate('/manage-listings/post');
  };

  const handleEdit = (listing) => {
    // Ensure the listing object has an 'id' property
    console.log(listing);
    navigate('/manage-listings/post', { state: { listing: listing } });
  };

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
        try {
            const response = await fetch(`http://localhost:8000/delete-dog-listing/${listingId}/`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Remove the listing from the state or refresh the listings
            setUserDogListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    }
};

  useEffect(() => {
    const fetchUserDogListings = async () => {
      try {
        const response = await fetch('http://localhost:8000/get-user-dog-listings/', {
        method: 'GET',
       credentials: 'include' 
    });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userListings = await response.json();
        setUserDogListings(userListings);
      } catch (error) {
        console.error('Error fetching user dog listings:', error);
      }
    };
  
    fetchUserDogListings();
  }, []);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleToggleDropdown = (listingId) => {
    setActiveDropdown(activeDropdown === listingId ? null : listingId);
};

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
    <div className="manage-container">
      <div className="white-rectangle">
        <div className="profile-rectangle">
        <div className="welcome-text"> 
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
        <div className="listings-rectangle">
          {userDogListings.length === 0 ? (
            <>
              <div className="postdog-heading">Post your first dog for adoption</div>
              <div className="listings-subheading">
                You do not have any active listings, post now and we can help connect your dog to his forever home.
              </div>
              <div className="new-post-button" onClick={navigateToPostDog}>
                <div className="new-post-text">New Post</div>
              </div>
            </>
          ) : (
            <>
                <div className="listings-search-bar">
                    <input type="text" placeholder="Search listings" />
                </div>
                <img src={magnifyGlass} alt="Magnify Glass" className="magnifying-glass"/>
                <div className="small-new-post-button" onClick={navigateToPostDog}>
                    <div className="small-new-post-text">New Post</div>
                </div>
                <div className="label-rectangle">
                <div className="label-data-container">
                            <div className="listing-label name">Name</div>
                            {userDogListings.map((listing, index) => (
                                <div key={index} className={index === 0 ? "listing-data-first name" : "listing-data name"}>{listing.name}</div>
                            ))}
                        </div>
                        {/* Age Label */}
                        <div className="label-data-container">
                            <div className="listing-label">Age</div>
                            {userDogListings.map((listing, index) => (
                                <div key={index} className={index === 0 ? "listing-data-first" : "listing-data"}>{listing.age} {listing.age_unit}</div>
                            ))}
                        </div>
                        {/* Breed Label */}
                        <div className="label-data-container">
                            <div className="listing-label">Breed</div>
                            {userDogListings.map((listing, index) => (
                                <div key={index} className={index === 0 ? "listing-data-first" : "listing-data"}>{listing.breed}</div>
                            ))}
                        </div>
                  {/* Status Label */}
                  <div className="label-data-container">
                    <div className="listing-label">Status</div>
                    {userDogListings.map((listing, index) => (
                        <div key={index} className={`${index === 0 ? "listing-data-first" : "listing-data"} active-status`}>Active</div>
                    ))}
                </div>
                 {/* Action Label */}
                <div className="label-data-container">
                  <div className="listing-label action">Action</div>
                  {userDogListings.map((listing, index) => (
                    <div key={index} className={index === 0 ? "listing-data-first action-dropdown" : "listing-data action-dropdown"}>
                      <button onClick={() => handleToggleDropdown(listing.id)} className="dropdown-toggle">
                        Actions
                      </button>
                      {activeDropdown === listing.id && (
                        <div className="dropdown-content">
                          <button onClick={() => handleEdit(listing)} className="dropdown-item">Edit</button>
                          <button onClick={() => handleDelete(listing.id)} className="dropdown-item">Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                </div>
                <div className="line line1"></div>
                <div className="line line2"></div>
                <div className="line line3"></div>

                <div className="image-container">
                        {userDogListings.map((listing, index) => (
                            <img key={index} src={listing.images[0]} alt={listing.name} className="profile-image" />
                        ))}
                    </div>
            </>
        )}
      </div>
    </div>
  </div>
);
};

export default ManageListingsPage;