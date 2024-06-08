import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/Appointment.css';

const Appointment = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [gender, setGender] = useState('');
  const [noOfPeople, setNoOfPeople] = useState('');
  const [peopleGenders, setPeopleGenders] = useState('');
  const [proof, setProof] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('flight_id', id);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('date', date);
    formData.append('gender', gender);
    formData.append('no_of_people', noOfPeople);
    formData.append('people_genders', peopleGenders);
    formData.append('proof', proof);

    try {
      const response = await fetch('http://localhost:5000/api/book-flight', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setBookingStatus('success');
      } else {
        const errorData = await response.json();
        setBookingStatus(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setBookingStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="app-body">
      {bookingStatus === 'success' ? (
        <div className="container success-message">
          <div className="tick">✓</div>
          <p>Ticket booked successfully!</p>
        </div>
      ) : (
        <div className="container">
          <h2>Appointment for Flight </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Gender:</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Number of People:</label>
              <input
                type="number"
                value={noOfPeople}
                onChange={(e) => setNoOfPeople(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Genders of People:</label>
              <input
                type="text"
                value={peopleGenders}
                onChange={(e) => setPeopleGenders(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Upload Proof:</label>
              <input
                type="file"
                onChange={(e) => setProof(e.target.files[0])}
                required
              />
            </div>
            <button type="submit">Book Flight</button>
          </form>
          {bookingStatus && <p className="error-message">{bookingStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default Appointment;
