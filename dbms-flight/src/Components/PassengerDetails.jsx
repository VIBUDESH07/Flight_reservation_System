import React, { useState, useEffect } from 'react';
import '../Styles/PassengerDetails.css';

const PassengerDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      setError('No email found in localStorage. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log(email);
        const response = await fetch(`http://localhost:5000/api/bookings?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError('An error occurred while fetching bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId, flightId, noOfPeople) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cancel-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, flightId, noOfPeople }),
      });

      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('An error occurred while cancelling the booking.');
    }
  };

  return (
    <div className="passenger-body">
      <div className="container">
        <h2>Your Bookings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul className="booking-list">
            {bookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                <h3>Flight ID: {booking.flight_id}</h3>
                <p>Name: {booking.name}</p>
                <p>Email: {booking.email}</p>
                <p>Phone: {booking.phone}</p>
                <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p>Gender: {booking.gender}</p>
                <p>Number of People: {booking.no_of_people}</p>
                <p>Genders of People: {booking.people_genders}</p>
                <button
                  className="cancel-button"
                  onClick={() => handleCancelBooking(booking.id, booking.flight_id, booking.no_of_people)}
                >
                  Cancel Booking
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PassengerDetails;
