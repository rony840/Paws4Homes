import { useParams } from 'react-router-dom';
import './DogInfo.css';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const DogInfo = () => {
  const { id } = useParams(); 
  const [dogDetails, setDogDetails] = useState(null);
  const fetchedDataRefs = useRef([]);
  const [buttonTopPosition, setButtonTopPosition] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();


  const handleAdoptMeClick = () => {
    navigate(`/adopt/${id}`, { state: { dogDetails } }); 
  };


  useEffect(() => {
    const fetchDogDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-dog-listing/${id}`); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDogDetails(data);
      } catch (error) {
        console.error('Error fetching dog details:', error);
      }
    };

    fetchDogDetails();
  }, [id]);

  useEffect(() => {
    if (dogDetails && dogDetails.images && dogDetails.images.length > 0) {
      setSelectedImage(dogDetails.images[0]);
    }
  }, [dogDetails]);

  useLayoutEffect(() => {
    let lastLineBottom = 0;
  
    fetchedDataRefs.current.forEach((el, index) => {
      if (el) {
        const height = el.offsetHeight;
        const lineTopPosition = el.offsetTop + height + 15; 
  
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.width = '779px';
        line.style.height = '1px';
        line.style.backgroundColor = 'black';
        line.style.top = `${lineTopPosition}px`;
        line.style.left = '-309px'; 
  
        el.parentElement.appendChild(line);
  
        lastLineBottom = lineTopPosition + 1; 
      }
  
      if (index === 6) {
        setButtonTopPosition(lastLineBottom + 48);
      }
    });
  }, [dogDetails]);
  
  

  if (!dogDetails) {
    return <div>Loading...</div>; 
  }



  return (
    <div className="dog-info-container">
      <div className="beige-rectangle">
        <div className="fetched-dog-name">{dogDetails.name}</div>
        <div className="fetched-label-container">
        <div className="fetched-label">Breed: </div>
        <div className="fetched-label">Age:  </div>
        <div className="fetched-label">Color: </div>
        <div className="fetched-label">Gender: </div>
        <div className="fetched-label">Size: </div>
        <div className="fetched-label">Date Posted: </div>
        <div className="fetched-label">Bio: </div>
      </div>

      <div className="fetched-data-container">
        <div className="fetched-data" ref={el => fetchedDataRefs.current[0] = el}>{dogDetails.breed}</div>
        <div className="fetched-data" ref={el => fetchedDataRefs.current[1] = el}>{dogDetails.age} {dogDetails.age_unit}</div>
        <div className="fetched-data" ref={el => fetchedDataRefs.current[2] = el}>{dogDetails.color}</div>
        <div className="fetched-data" ref={el => fetchedDataRefs.current[3] = el}>{dogDetails.gender}</div>
        <div className="fetched-data" ref={el => fetchedDataRefs.current[4] = el}>{dogDetails.size}</div>
        <div className="fetched-data" ref={el => fetchedDataRefs.current[5] = el}>{dogDetails.date_added}</div>
        <div className="fetched-data" ref={el => fetchedDataRefs.current[6] = el}>{dogDetails.bio}</div>
        <div className="application-button" style={{ top: `${buttonTopPosition}px` }} onClick={handleAdoptMeClick}>
            <span className="application-button-text">Adopt Me!</span>
        </div>
      </div>
      <div className="fetched-dog-image-container">
      <img 
        src={selectedImage} 
        alt="Dog" 
        style={{width: '100%', height: '100%'}} 
      />
    </div>

    <div className="thumbnails-container" style={{ marginTop: '30px' }}>
      {dogDetails.images.map((image, index) => (
        <div key={index} className="thumbnail" onClick={() => setSelectedImage(image)}>
          <img src={image} alt={`Thumbnail ${index}`} style={{ width: '98px', height: '116px' }} />
        </div>
      ))}
    </div>
      </div>
    </div>
  );
};

export default DogInfo;
