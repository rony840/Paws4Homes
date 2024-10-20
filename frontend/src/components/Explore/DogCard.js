import React from 'react';
import logoPaw from '../../assets/img/pawIcon.png';

const DogCard = ({ image, name, age, breed, onImageClick, dimImage, tooltipText }) => {
  return (
    <div className={`dog-card ${dimImage ? 'dimmed' : ''}`}>
      <div className="dog-image-container" onClick={onImageClick}>
        <img src={image} alt={name} className="dog-image" />
        {dimImage && <div className="tooltip">{tooltipText}</div>} 
        <div className="info-rectangle">
          <div className="dog-name">{name}</div>
          <div className="dog-age">Age: {age}</div>
          <div className="dog-breed">Breed: {breed}</div>
        </div>
        <div className="logo-rectangle">
          <img src={logoPaw} alt="Logo Paw" className="logo-paw-image" />
        </div>
      </div>
    </div>
  );
};

export default DogCard;
