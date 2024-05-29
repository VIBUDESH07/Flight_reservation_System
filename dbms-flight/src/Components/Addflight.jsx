// src/Components/AddFlight.js

import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddFlight.css';

const AddFlight = () => {
  const [flightName, setFlightName] = useState('');
  const [destination, setDestination] = useState('');
  const [arrival, setArrival] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [flightImg, setFlightImg] = useState(null);

  const handleImageChange = (e) => {
    setFlightImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('flightName', flightName);
    formData.append('destination', destination);
    formData.append('arrival', arrival);
    formData.append('dateTime', dateTime);
    formData.append('flightImg', flightImg);

    try {
      const response = await axios.post('http://localhost:5000/api/add-flight', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('There was an error uploading the data!', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Flight Name:
          <input type="text" value={flightName} onChange={(e) => setFlightName(e.target.value)} required />
        </label>
        <label>
          Destination:
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required />
        </label>
        <label>
          Arrival:
          <input type="text" value={arrival} onChange={(e) => setArrival(e.target.value)} required />
        </label>
        <label>
          Date and Time:
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
        </label>
        <label>
          Flight Image:
          <input type="file" onChange={handleImageChange} required />
        </label>
        <button type="submit">Add Flight</button>
      </form>
    </div>
  );
};

export default AddFlight;
