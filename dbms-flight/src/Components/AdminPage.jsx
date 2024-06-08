import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate(); // Get the navigate function from React Router
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/flight-detail-admin');
        if (response.ok) {
          const data = await response.json();
          const flightsWithBase64Img = data.map(flight => {
            return {
              ...flight,
              flight_img_base64: `data:image/png;base64,${flight.flight_img_base64}`
            };
          });
          setFlights(flightsWithBase64Img);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError('An error occurred while fetching flights.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const handleUpdateFlight = (flightId) => {
    // Navigate to the update form page with the flight ID as a parameter
    navigate(`/update-flight/${flightId}`);
  };

  return (
    <div className="adminpage-body">
      <div className="adminpage-container">
        <h2>All Flights</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div>
            <ul className="flight-list">
              {flights.map((flight) => (
                <li key={flight.id} className="flight-item">
                  <div className="flight-details">
                    <p><strong>Flight Name:</strong> {flight.flight_name}</p>
                    <p><strong>Time:</strong> {flight.date_time}</p>
                    <p><strong>Departure:</strong> {flight.destination}</p>
                    <p><strong>Arrival:</strong> {flight.arrival}</p>
                    <p><strong>Available Seats:</strong> {flight.no_of_seats}</p>
                    <p><strong>Price:</strong> ${flight.price}</p>
                    <button onClick={() => handleUpdateFlight(flight.id)}>Update</button>
                  </div>
                  {flight.flight_img_base64 && (
                    <div className="flight-image">
                      <img src={flight.flight_img_base64} alt={flight.flight_name} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Link to="/add" className="add-flight-button">Add Flight</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
