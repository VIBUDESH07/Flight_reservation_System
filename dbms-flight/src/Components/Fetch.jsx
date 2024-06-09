import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Fetch.css';  // Ensure you have your styles in this CSS file
import Header from './Header'
const Fetch = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fromValue = localStorage.getItem('fromValue');
    const toValue = localStorage.getItem('toValue');
    
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/flight-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ from: fromValue, to: toValue }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setData(data);
        console.log(data);  // Print the data to the console
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    fetchData();
  }, []);

  const handleAppointment = (flightId) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate(`/appointment/${flightId}`);
    } else {
      navigate('/login');
    }
  };

  if (!data) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="fetching-text">Fetching</div>
      </div>
    );
  }

  return (
  
    <div className="flight-container">
      <h2>Flight Data</h2>
      {data.map((flight, index) => (
        <div key={index} className="flight-card">
          <div className="flight-image">
            <img src={`data:image/jpeg;base64,${flight.flight_img_base64}`} alt="Flight" />
          </div>
          <div className="flight-details">
            <p className="head">{flight.flight_name}</p>
            <p className="dest">{flight.destination} to {flight.arrival}</p>
            <p className="date">{flight.date_time}</p>
            <p className="date">RS. {flight.price}/-</p>
            <p className="date">{flight.no_of_seats} Seats Available</p>
            <button
              className="btn-container"
              onClick={() => handleAppointment(flight.id)}  // Ensure `flight.id` is available
            >
              Book a Flight
            </button>
          </div>
        </div>
        
      ))}
    </div>
  );
};

export default Fetch;
