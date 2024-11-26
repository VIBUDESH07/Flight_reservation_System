import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/Appointment.css';

const Appointment = () => {
  const navigate = useNavigate();
  const { id: flight_id, date: date1 } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [gender, setGender] = useState('');
  const [noOfPeople, setNoOfPeople] = useState('');
  const [flightType, setFlightType] = useState('one-way');
  const [is_available, setIs_Available] = useState(false);
  const [peopleDetails, setPeopleDetails] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [flightDetails, setFlightDetails] = useState(null);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [price, setPrice] = useState('');
  const [f_id, setF_Id] = useState(0);
  const formattedDate = date1 ? new Date(date1).toISOString().split('T')[0] : '';

  const handlePersonChange = (index, field, value) => {
    const newPeopleDetails = [...peopleDetails];
    newPeopleDetails[index] = { ...newPeopleDetails[index], [field]: value };
    setPeopleDetails(newPeopleDetails);
  };

  const handleProofChange = (index, file) => {
    const newProofs = [...proofs];
    newProofs[index] = file;
    setProofs(newProofs);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (flightType === 'round-trip' && is_available) {
      const suggestedReturnDate = availabilityMessage?.returnDate;

      if (suggestedReturnDate) {
        // Format both dates (user's return date and suggested date) to the same format (YYYY-MM-DD)
        const suggestedDate = new Date(suggestedReturnDate).toISOString().split('T')[0];

        // Convert the user entered returnDate from DD-MM-YYYY to YYYY-MM-DD
        const [day, month, year] = returnDate.split('-');
        const userFormattedDate = `${day}-${month}-${year}`;
        console.log(suggestedDate,userFormattedDate)
        if (suggestedDate !== userFormattedDate) {
          alert(
            `Your selected return date does not match the suggested date: ${suggestedDate}. Please adjust your selection.`
          );
          return;
        }
      }
    }

    const appointmentData = {
      flight_id,
      name,
      email,
      phone,
      formattedDate,
      gender,
      noOfPeople,
      flightType,
      peopleDetails,
      price,
      proofs,
    };

    if (is_available) {
      appointmentData.f_id = f_id;
    }

    console.log(appointmentData);

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

  const fetchFlightDetails = async (flight_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/flight-Details/${flight_id}`);
      const data = await response.json();

      if (data.data) {
        setFlightDetails(data.data);
        setPrice(data.data.price);
      } else {
        setFlightDetails(null);
      }
    } catch (error) {
      console.error('Error fetching flight details:', error);
      setFlightDetails(null);
    }
  };

  const checkReturnDateAvailability = async (noOfPeople, returnDate) => {
    try {
      const response = await fetch('http://localhost:5000/api/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: flightDetails?.destination,
          to: flightDetails?.arrival,
          noOfPeople,
          returnDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAvailabilityMessage(data.flightDetails);
        setIs_Available(true);
        setPrice(flightDetails.price + data.flightDetails.price);
        setF_Id(data.flightDetails.id);
      } else {
        console.error(data.error || 'Error checking availability');
        setAvailabilityMessage('Error checking return date availability');
      }
    } catch (error) {
      console.error('Request failed:', error);
      setAvailabilityMessage('Error checking return date availability');
    }
  };

  useEffect(() => {
    if (flight_id) {
      fetchFlightDetails(flight_id);
    }
  }, [flight_id]);

  useEffect(() => {
    if (flightType === 'round-trip' && returnDate) {
      checkReturnDateAvailability(noOfPeople, returnDate);
    }
  }, [returnDate, flightType, noOfPeople, flight_id]);

  return (
    <div className="app-body">
      <div className="container">
        <h2>Appointment for Flight</h2>
        {flightDetails ? (
          <div>
            <h3>Flight Details:</h3>
            <p>Flight Name: {flightDetails.flight_name}</p>
            <p>Destination: {flightDetails.destination}</p>
            <p>Arrival: {flightDetails.arrival}</p>
          </div>
        ) : (
          <p>Loading flight details...</p>
        )}
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
          {flightType === 'round-trip' && (
            <div>
              <label>Return Date:</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={formattedDate}
                required={flightType === 'round-trip'}
              />
              {returnDate && returnDate !== availabilityMessage.returnDate && (
                <p className="error">
                  Please select the suggested return date: {availabilityMessage.returnDate}.
                </p>
              )}
            </div>
          )}
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
            <label>Flight Type:</label>
            <select value={flightType} onChange={(e) => setFlightType(e.target.value)} required>
              <option value="one-way">One-way</option>
              <option value="round-trip">Round-trip</option>
            </select>
          </div>
          <div>
            <label>Number of People:</label>
            <input
              type="number"
              value={noOfPeople}
              onChange={(e) => setNoOfPeople(e.target.value)}
              min="1"
              required
            />
          </div>
          {renderPeopleInputs()}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
