import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/UpdateFlight.css';

const UpdateFlight = () => {
  const { id } = useParams(); // Get the flight ID from the URL params
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedFlightDetails, setUpdatedFlightDetails] = useState({
    flightName: '',
    destination: '',
    arrival: '',
    dateTime: '',
    noOfSeats: '',
    email: '',
    price: '',
  });

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/update-flt/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFlight(data);
          setUpdatedFlightDetails({
            flightName: data.flight_name,
            destination: data.destination,
            arrival: data.arrival,
            dateTime: data.date_time,
            noOfSeats: data.no_of_seats,
            email: data.email,
            price: data.price,
          });
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError('An error occurred while fetching flight details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFlightDetails({
      ...updatedFlightDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(updatedFlightDetails);
      const response = await fetch(`http://localhost:5000/api/update-flt/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFlightDetails),
      });
      if (response.ok) {
        const updatedFlight = await response.json();
        console.log('Flight updated successfully:', updatedFlight);
      } else {
        const errorData = await response.json();
        console.error('Error updating flight:', errorData.error);
      }
    } catch (error) {
      console.error('An error occurred while updating flight:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="update-body">
      <div className="update-container">
        <h2>Update Flight Details</h2>
        {flight && (
          <form onSubmit={handleSubmit} className="update-form">
            <label>
              Flight Name:
              <input type="text" name="flightName" value={updatedFlightDetails.flightName} onChange={handleChange} required />
            </label>
            <label>
              Destination:
              <input type="text" name="destination" value={updatedFlightDetails.destination} onChange={handleChange} required />
            </label>
            <label>
              Arrival:
              <input type="text" name="arrival" value={updatedFlightDetails.arrival} onChange={handleChange} required />
            </label>
            <label>
              Date and Time:
              <input type="datetime-local" name="dateTime" value={updatedFlightDetails.dateTime} onChange={handleChange} required />
            </label>
            <label>
              No. of Seats:
              <input type="number" name="noOfSeats" value={updatedFlightDetails.noOfSeats} onChange={handleChange} required />
            </label>
            <label>
              Price:
              <input type="number" name="price" value={updatedFlightDetails.price} onChange={handleChange} required />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={updatedFlightDetails.email} onChange={handleChange} required />
            </label>
            <button type="submit" className="update-button">Update</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateFlight;
