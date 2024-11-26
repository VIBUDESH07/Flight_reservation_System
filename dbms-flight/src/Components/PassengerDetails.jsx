import React, { useState, useEffect } from 'react';
import '../Styles/PassengerDetails.css';

const PassengerDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [upcomingJourneys, setUpcomingJourneys] = useState([]);
  const [pastJourneys, setPastJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cancelBookingData, setCancelBookingData] = useState(null); // Store booking details for cancellation

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      setError('No email found in localStorage. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          const currentDate = new Date();

          const upcoming = data.filter((booking) => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= currentDate;
          });

          const past = data.filter((booking) => {
            const bookingDate = new Date(booking.date);
            return bookingDate < currentDate;
          });

          setBookings(data);
          setUpcomingJourneys(upcoming);
          setPastJourneys(past);
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

  const handleCancelBooking = (bookingId, flightId, noOfPeople) => {
    setCancelBookingData({ bookingId, flightId, noOfPeople });
    setShowConfirmation(true);
  };

  const confirmCancellation = async () => {
    if (!upiId) {
      setError('Please enter your UPI ID to proceed.');
      return;
    }

    try {
      const { bookingId, flightId, noOfPeople } = cancelBookingData;
      const response = await fetch('http://localhost:5000/api/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, flightId, noOfPeople, upiId }),
      });

      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
        setUpcomingJourneys(upcomingJourneys.filter((booking) => booking.id !== bookingId));
        setPastJourneys(pastJourneys.filter((booking) => booking.id !== bookingId));
        setShowConfirmation(false);
        setUpiId('');
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
        ) : (
          <>
            {/* Upcoming Journeys */}
            <div className="journey-section">
              <h3>Upcoming Journeys</h3>
              {upcomingJourneys.length === 0 ? (
                <p>No upcoming journeys found.</p>
              ) : (
                <ul className="booking-list">
                  {upcomingJourneys.map((booking) => (
                    <li key={booking.id} className="booking-item">
                      <h4>Flight ID: {booking.flight_id}</h4>
                      <h2>Booking Id: {booking.id}</h2>
                      <p>Name: {booking.name}</p>
                      <p>Email: {booking.email}</p>
                      <p>Phone: {booking.phone}</p>
                      <p>Date: {new Date(booking.date).toLocaleString()}</p>
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

            {/* Past Journeys */}
            <div className="journey-section">
              <h3>Past Journeys</h3>
              {pastJourneys.length === 0 ? (
                <p>No past journeys found.</p>
              ) : (
                <ul className="booking-list">
                  {pastJourneys.map((booking) => (
                    <li key={booking.id} className="booking-item">
                      <h4>Flight ID: {booking.flight_id}</h4>
                      <p>Name: {booking.name}</p>
                      <p>Email: {booking.email}</p>
                      <p>Phone: {booking.phone}</p>
                      <p>Date: {new Date(booking.date).toLocaleString()}</p>
                      <p>Gender: {booking.gender}</p>
                      <p>Number of People: {booking.no_of_people}</p>
                      <p>Genders of People: {booking.people_genders}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>70% of the amount will be refunded. Please enter your UPI ID to confirm the cancellation.</p>
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
          <button onClick={confirmCancellation}>Confirm Cancellation</button>
          <button onClick={() => setShowConfirmation(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PassengerDetails;
