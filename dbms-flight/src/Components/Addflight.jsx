import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddFlight.css';

const AddFlight = () => {
  const [flightName, setFlightName] = useState('');
  const [destination, setDestination] = useState('');
  const [arrival, setArrival] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [noOfSeats, setNoOfSeats] = useState('');
  const [email, setEmail] = useState('');
  const [flightImg, setFlightImg] = useState(null);
  const [Price, setPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    formData.append('noOfSeats', noOfSeats);
    formData.append('email', email);
    formData.append('price', Price);
    formData.append('flightImg', flightImg);

    try {
      const response = await axios.post('http://localhost:5000/api/add-flight', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setSuccessMessage('Flight added successfully!');
      setErrorMessage('');
      // Clear form fields after successful submission
      setFlightName('');
      setDestination('');
      setArrival('');
      setDateTime('');
      setNoOfSeats('');
      setEmail('');
      setPrice('');
      setFlightImg(null);
    } catch (error) {
      console.error('There was an error uploading the data!', error);
      setSuccessMessage('');
      setErrorMessage('Failed to add flight. Please try again.');
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
          No. of Seats:
          <input type="number" value={noOfSeats} onChange={(e) => setNoOfSeats(e.target.value)} required />
        </label>
        <label>
          Price:
          <input type="number" value={Price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Flight Image:
          <input type="file" onChange={handleImageChange} required />
        </label>
        <button type="submit">Add Flight</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default AddFlight;
