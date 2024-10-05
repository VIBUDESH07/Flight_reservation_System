import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/Appointment.css';

const Appointment = () => {
  const navigate = useNavigate();
  const { id: flight_id } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [gender, setGender] = useState('');
  const [noOfPeople, setNoOfPeople] = useState('');
  const [peopleDetails, setPeopleDetails] = useState([]); // Store details for each person
  const [proofs, setProofs] = useState([]); // Store proofs for each person

  const handlePersonChange = (index, field, value) => {
    const newPeopleDetails = [...peopleDetails];
    newPeopleDetails[index] = {
      ...newPeopleDetails[index],
      [field]: value,
    };
    setPeopleDetails(newPeopleDetails);
  };

  const handleProofChange = (index, file) => {
    const newProofs = [...proofs];
    newProofs[index] = file;
    setProofs(newProofs);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare the appointment data to send to the payment page
    const appointmentData = {
      flight_id,
      name,
      email,
      phone,
      date,
      gender,
      noOfPeople,
      peopleDetails, // Include people details
      proofs, // Include proofs for each person
    };

    // Navigate to the payment page and pass the appointment data as state
    navigate('/payment', { state: appointmentData });
  };

  const renderPeopleInputs = () => {
    const inputs = [];
    for (let i = 0; i < noOfPeople; i++) {
      inputs.push(
        <div key={i} className="person-details">
          <h3>Person {i + 1}</h3>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={peopleDetails[i]?.name || ''}
              onChange={(e) => handlePersonChange(i, 'name', e.target.value)}
              required
            />
          </div>
          <div>
            <label>Gender:</label>
            <select
              value={peopleDetails[i]?.gender || ''}
              onChange={(e) => handlePersonChange(i, 'gender', e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              value={peopleDetails[i]?.age || ''}
              onChange={(e) => handlePersonChange(i, 'age', e.target.value)}
              required
            />
          </div>
          <div>
            <label>Upload Proof:</label>
            <input
              type="file"
              onChange={(e) => handleProofChange(i, e.target.files[0])}
              required
            />
          </div>
        </div>
      );
    }
    return inputs;
  };

  return (
    <div className="app-body">
      <div className="container">
        <h2>Appointment for Flight</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Phone:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
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
              onChange={(e) => {
                const number = Math.max(1, Number(e.target.value)); // Ensure at least one person
                setNoOfPeople(number);
                // Reset people details and proofs when changing the number
                setPeopleDetails(new Array(number).fill({}));
                setProofs(new Array(number).fill(null));
              }}
              required
            />
          </div>
          {/* Render inputs for each person */}
          {noOfPeople > 0 && renderPeopleInputs()}
          <button type="submit">Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
