import React, { useState, useEffect, useRef } from 'react';
import audioFile from './assets/audio.mp3';

const ShapeClickGame = () => {
  const [shapes, setShapes] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const popoverRef = useRef(null);
  const shapeContainerRef = useRef(null);
  const popSoundRef = useRef(new Audio(audioFile));

  const shapeTypes = ['circle', 'square'];

  // Function to generate a random shape with x, y, type properties
  const generateRandomShape = () => {
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const x = Math.random() * (shapeContainerRef.current.clientWidth - 50); // Width of shape is 50px
    const y = Math.random() * (shapeContainerRef.current.clientHeight - 50); // Height of shape is 50px
    return { type, x, y };
  };

  // Function to handle shape clicks
  const handleShapeClick = (index) => {
    const clickedShape = shapes[index];
    if (clickedShape) {
      setShapes(shapes.filter((shape, i) => i !== index));
      setScore((prevScore) => prevScore + 10); // Increase the score when the user clicks on a shape
      playPopSound(); // Play the popping sound when the user clicks on a shape
    } else {
      showPopover();
    }
  };
 
   // Function to play the sound
  


  const showPopover = () => {
    popoverRef.current.style.display = 'block';
    setTimeout(() => {
      popoverRef.current.style.display = 'none';
    }, 1500);
  };
  
  
  
  const playPopSound = () => {
    if (popSoundRef.current) {
        popSoundRef.current.play();
      }
  };

  const handleContainerClick = (e) => {
    if (e.target === shapeContainerRef.current) {
      showPopover();
    }
  };

  useEffect(() => {
    // Generate a new shape every 2 seconds
    const intervalId = setInterval(() => {
      const newShape = generateRandomShape();
      setShapes((prevShapes) => [...prevShapes, newShape]);
    }, 2000);

    // Countdown timer to remove shapes after 3 seconds
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clear intervals on component unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, [shapes]);

  useEffect(() => {
    // When timeLeft reaches 0, remove all shapes and reset timer
    if (timeLeft === 0) {
      setShapes([]);
      setTimeLeft(3);
    }
  }, [timeLeft]);

  return (
    <div>
      <h1>Shape Click Game</h1>
      <p>Score: {score}</p>
      <div className='shape'
        ref={shapeContainerRef}
        style={{ position: 'relative',
        width: '450px',
        height: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid',
        overflow: 'hidden', 
    }}
        onClick={handleContainerClick}
      >
        {shapes.map((shape, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: shape.x,
              top: shape.y,
              width: '50px',
              height: '50px',
              backgroundColor: shape.type === 'circle' ? 'blue' : 'red',
              borderRadius: shape.type === 'circle' ? '50%' : '0%',
              cursor: 'pointer',
            }}
            onMouseDown={() => handleShapeClick(index)}
          ></div>
        ))}
      </div>
      <div
        ref={popoverRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '5px',
          display: 'none',
        }}
      >
        Oops! You clicked on a blank space.
      </div>
      
    </div>
  );
};

export default ShapeClickGame;


