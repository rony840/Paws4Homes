import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';
import { useTransition, animated } from 'react-spring';
import image1 from '../../assets/img/winterDog.jpg';
import image2 from '../../assets/img/dogSword.png';
import image3 from '../../assets/img/dogCool.jpg';
import image4 from '../../assets/img/dogPuppy.jpg';
import image5 from '../../assets/img/dogBubbles.jpg';
import image6 from '../../assets/img/dogGrass.jpeg';


// Define your background images and the associated text
const backgroundData = [
  { img: image1, text: 'FUN', color: '#FFD600' },
  { img: image2, text: 'ADVENTURE', color: '#FF0000' },
  { img: image3, text: 'COOL', color: '#000000' },
  { img: image4, text: 'CUTENESS', color: '#F8C8DC' },
  { img: image5, text: 'CURIOSITY', color: '#008080' },
  { img: image6, text: 'SILLY', color: '#FF7F50' },

];

const Home = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % backgroundData.length);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  const transitions = useTransition(index, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 2500 },
  });

  return (
    <main className="home-container">
      <div className="section section-one">
        {transitions((style, i) => {
          const bg = backgroundData[i];
          return (
            <animated.div
              key={i}
              className="hero"
              style={{
                ...style,
                backgroundImage: `url(${bg.img})`,
                position: 'absolute',
                width: '100%',
                height: '100%',
                willChange: 'opacity',
              }}
            >
              <div className="dose-text">The ideal dose</div>
              <div className="of-text" style={{ color: bg.color }}>
                of {bg.text}
              </div>
            </animated.div>
          );
        })}

       

        <div className="buttons">
          <button className="btn explore">Explore dogs</button>
          <button className="btn match">Match with a dog</button>
        </div>
      </div>

      <div className="svg-container">
          {/* SVG Shape 2 */}
          <svg className="svg-shape svg-shape-1" xmlns="http://www.w3.org/2000/svg" width="1920" height="1280" viewBox="0 0 1920 1280" fill="none">
            {/* SVG Path */}
            <path d="M481.735 97.2031C299.149 107.114 120.024 70.9632 72.3446 32.3853L-19.207 1249.73C-19.207 1249.73 273.226 1465.57 498.731 1515.03C797.787 1580.61 973.871 1447.23 1282.44 1435.33C1583.26 1423.72 2051.35 1466.68 2051.35 1466.68L2150.55 191.892C2057.48 151.412 1798.06 74.1718 1466.65 20.0749C1050.78 -47.8084 709.968 84.8142 481.735 97.2031Z" fill="#008080"/>
          </svg>
          {/* SVG Shape 1 */}
          <svg className="svg-shape svg-shape-2" xmlns="http://www.w3.org/2000/svg" width="1920" height="1255" viewBox="0 0 1920 1255" fill="none">
            {/* SVG Path */}
            <path d="M450.521 93.3547C250.12 101.525 52.9175 63.6128 0.0459699 24.5329L-88.2706 1217.6C-88.2706 1217.6 235.733 1436.51 484.05 1488.18C813.357 1556.71 1006.97 1410.05 1345.71 1401.1C1675.94 1392.37 2190.59 1439.87 2190.59 1439.87L2287.82 179.987C2185.06 138.567 1887.09 46.7109 1517.24 10.6381C1054.93 -34.453 701.023 83.1421 450.521 93.3547Z" fill="url(#paint0_linear_222_507)"/>
            <defs>
              <linearGradient id="paint0_linear_222_507" x1="229.023" y1="702.923" x2="1092.08" y2="-558.713" gradientUnits="userSpaceOnUse">
                <stop stop-color="#008080"/>
                <stop offset="1" stop-color="white"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

      <div className="section section-two">
        {/* Content for the second section */}
        
        <div>Your content for the second section goes here.</div>
      </div>
    </main>
  );
};

export default Home;