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
  const [is_available,setIs_Available] = useState(false);
  const [peopleDetails, setPeopleDetails] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [flightDetails, setFlightDetails] = useState(null); // Store flight details
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const[price,setPrice]=useState('');
  const[f_id,setF_Id]=useState(0);
  const formattedDate = date1 ? new Date(date1).toISOString().split('T')[0] : '';
 
  // Handle dynamic people details change
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
  
    // Prepare appointment data
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
  
    // Add f_id for round-trip flights
    if ( is_available) {
      appointmentData.f_id = f_id;
    }
    console.log(appointmentData)
    // Navigate to the payment page with all necessary data
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

  // Fetch flight details
  const fetchFlightDetails = async (flight_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/flight-Details/${flight_id}`);
      const data = await response.json();
      
      console.log(data); // Log the entire response to verify
      console.log(data.data); // Log flightDetails specifically
  
      if (data.data) {
        setFlightDetails(data.data); 
        setPrice(data.data.price) // Now using the correct key from the backend
      } else {
        setFlightDetails(null);
      }
    } catch (error) {
      console.error('Error fetching flight details:', error);
      setFlightDetails(null);
    }
  };

  // Check return date availability
  const checkReturnDateAvailability = async (noOfPeople, returnDate) => {
    console.log(noOfPeople, returnDate);
    try {
      const response = await fetch('http://localhost:5000/api/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: flightDetails?.destination,
          to: flightDetails?.arrival,
          noOfPeople: noOfPeople,

          returnDate: returnDate
        })
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setAvailabilityMessage(data.flightDetails);
        setIs_Available(true)
        
        setPrice(flightDetails.price+data.flightDetails.price);
      } else {
        console.error(data.error || 'Error checking availability');
        setAvailabilityMessage('Error checking return date availability');
      }
    } catch (error) {
      console.error('Request failed:', error);
      setAvailabilityMessage('Error checking return date availability');
    }
    if(is_available){
      console.log(availabilityMessage.id)
      setF_Id(availabilityMessage.id)
    }
  };

  useEffect(() => {
    if (flight_id) {
      fetchFlightDetails(flight_id); // Fetch flight details on component mount
    }
  }, [flight_id]);

  useEffect(() => {
    if (flightType === 'round-trip' && returnDate) {
      checkReturnDateAvailability(noOfPeople, returnDate); // Check return date availability when returnDate or noOfPeople changes
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
                min={formattedDate} // Ensure return date is after departure date
                required={flightType === 'round-trip'}
              />
            </div>
          )}
          <p>
            {availabilityMessage.returnDate}
          </p>
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
              <option value="one-way">One Way</option>
              <option value="round-trip">Round Trip</option>
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
                setPeopleDetails(new Array(number).fill({})); // Reset people details
                setProofs(new Array(number).fill(null)); // Reset proofs
              }}
              required
            />
          </div>
          {noOfPeople > 0 && renderPeopleInputs()}
          <button type="submit">Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
