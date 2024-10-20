import React, { useRef, useState, useEffect  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './postDog.css';
import InputPair from './InputPair';
import DogCard from '../Explore/DogCard';
import kobe from '../../assets/img/kobePup.jpg';

const PostDog = () => {
    const fileInputRefs = useRef([]);
    const [dogImages, setDogImages] = useState(new Array(5).fill(null));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dogName, setDogName] = useState('');
    const [dogAge, setDogAge] = useState('');
    const [dogUnit, setDogUnit] = useState(''); 
    const [dogBreed, setDogBreed] = useState('');
    const [dogBio, setDogBio] = useState('');
    const [dogSize, setDogSize] = useState('');
    const [dogColor, setDogColor] = useState('');
    const [dogGender, setDogGender] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipText, setTooltipText] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const listingToEdit = location.state?.listing;

    useEffect(() => {
      console.log(listingToEdit);
      if (listingToEdit) {
          setDogName(listingToEdit.name);
          setDogAge(listingToEdit.age);
          setDogUnit(listingToEdit.age_unit);
          setDogBreed(listingToEdit.breed);
          setDogBio(listingToEdit.bio);
          setDogSize(listingToEdit.size);
          setDogColor(listingToEdit.color);
          setDogGender(listingToEdit.gender);
          setDogImages(listingToEdit.images);
      }
  }, [listingToEdit]);

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        if (fileInputRefs.current[index]) {
          fileInputRefs.current[index].click();
        }
      };
    
      const handleImageChange = (index) => (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const newImages = [...dogImages];
            newImages[index] = e.target.result;
            setDogImages(newImages);
          };
          reader.readAsDataURL(file);
        }
      };
    
      const handlePreviewClick = (index) => {
        if (dogImages[index]) {
          setCurrentImageIndex(index);
        } else {
          handleImageClick(index);
        }
      };

      const handleMouseEnter = (tooltipMsg) => {
        setShowTooltip(true);
        setTooltipText(tooltipMsg);
      }; 
    
      const handleMouseLeave = () => {
        setShowTooltip(false);
        setTooltipText('');
      };

      const handleSubmit = async () => {
        // Prepare the form data with all fields
        const formData = {
            name: dogName,
            breed: dogBreed,
            age: dogAge,
            ageUnit: dogUnit,
            color: dogColor, 
            size: dogSize, 
            bio: dogBio, 
            gender: dogGender, 
            images: dogImages.filter(Boolean) 
        };
    
        const url = listingToEdit
        ? `http://localhost:8000/update-dog-listing/${listingToEdit.id}/`
        : 'http://localhost:8000/submit-dog-listing/';
        const method = listingToEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // Include CSRF token and authentication headers as needed
                },
                credentials: 'include', 
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Dog listing processed successfully!', data);
                navigate('/manage-listings'); // Redirect to listings page or as appropriate
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };
  return (
    <div className="manage-container">
      <div className="beige-rectangle">
      <div className="heading-text">
          List Your Dog for Adoption Here!
            </div>
            <div className="form-style">
          <div className="input-group">
          <InputPair label="Name" id="name" placeholder="Name" value={dogName} onChange={(e) => setDogName(e.target.value)} />
          <InputPair label="Breed" id="breed" placeholder="Breed" value={dogBreed} onChange={(e) => setDogBreed(e.target.value)} />
          </div>
          <div className="input-group">
            <div className="input-group age-unit-group">
            <InputPair label="Age" id="age" placeholder="Age" value={dogAge} onChange={(e) => setDogAge(e.target.value)} />
            <InputPair label="Unit" id="age-unit" inputType="dropdown" options={[{ value: '', label: 'Choose', disabled: true, selected: true },{ value: 'months', label: 'Months' }, { value: 'years', label: 'Years' }]} value={dogUnit} onChange={(e) => setDogUnit(e.target.value)} />
          </div>
          <InputPair label="Color" id="color" placeholder="Color" value={dogColor} onChange={(e) => setDogColor(e.target.value)} />
          </div>
          
          <div className="input-group">
          <InputPair label="Gender" id="gender" inputType="dropdown" options={[{ value: '', label: 'Choose', disabled: true, selected: true },{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]} value={dogGender} onChange={(e) => setDogGender(e.target.value)} />
            <InputPair label="Size" id="size" inputType="dropdown" options={[{ value: '', label: 'Choose', disabled: true, selected: true },{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]} value={dogSize} onChange={(e) => setDogSize(e.target.value)} />
          </div>
          <div className="input-group">
          <InputPair label="Bio" id="bio" placeholder="Add some fun facts about the dog!" isTextArea={true} value={dogBio} onChange={(e) => setDogBio(e.target.value)} />
          </div>
          </div>
          <div className="submit-button" onClick={handleSubmit}>
            Submit Your Listing
            </div>
        <div className="card-preview-text">Card Preview</div>
        <div
          className="dog-card-container"
          onMouseEnter={() => handleMouseEnter('Click here to upload new image')}
          onMouseLeave={handleMouseLeave} 
          onClick={() => handleImageClick(currentImageIndex)}
        >
          <DogCard
            image={dogImages[currentImageIndex] || kobe}
            name={dogName}
            age={`${dogAge} ${dogUnit}`}
            breed={dogBreed}
            dimImage={showTooltip} 
            tooltipText={tooltipText} 
          />
        </div>
        <div className="additional-images-container">
        {dogImages.map((image, index) => (
            <div
            key={index}
            className={`image-upload-square ${index === 0 ? 'profile-picture' : ''} ${!image ? 'dimmed' : ''}`}
            onClick={() => handlePreviewClick(index)}
            onMouseEnter={() => handleMouseEnter('Click here to upload image')}
            onMouseLeave={handleMouseLeave}
          >
            {!image && <div className="tooltip">Click here to upload image</div>}
            {image ? (
              <img src={image} alt={`Uploaded Image ${index + 1}`} />
            ) : (
              <div>{index === 0 ? '' : ''}</div>
            )}
            {index === 0 && <div className="main-picture-text">Main Photo</div>}
            <input
              type="file"
              ref={(el) => (fileInputRefs.current[index] = el)}
              onChange={handleImageChange(index)}
              style={{ display: 'none' }}
              accept="image/*"
            />
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default PostDog;