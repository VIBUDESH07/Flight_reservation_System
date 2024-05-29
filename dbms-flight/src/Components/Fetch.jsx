import React, { useEffect, useState } from 'react';
import '../Styles/Fetch.css';  // Add your styles here

const Fetch = () => {
  const [data, setData] = useState(null);

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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flight-container">
      <h2>Flight Data</h2>
      {data.map((flight, index) => (
        <div key={index} className="flight-card">
        <div>
          <img src={`data:image/jpeg;base64,${flight.flight_img_base64}`} alt="Flight" className="flight-image" />
          </div>
          <div className="flight-details">
            <p><strong>Flight Name:</strong> {flight.flight_name}</p>
            <p><strong>Destination:</strong> {flight.destination}</p>
            <p><strong>Arrival:</strong> {flight.arrival}</p>
            <p><strong>Date and Time:</strong> {flight.date_time}</p>
            <button className='btn-container'>Make Appointment</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Fetch;
