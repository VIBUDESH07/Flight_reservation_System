import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentData = location.state; // Retrieve the appointment data passed from the Appointment page
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = async () => {
    // Simulate payment processing
    const paymentSuccessful = true; // Simulate success for now

    if (paymentSuccessful) {
      try {
        // Prepare form data for flight booking
        const formData = new FormData();
        formData.append('flight_id', appointmentData.flight_id);
        formData.append('name', appointmentData.name);
        formData.append('email', appointmentData.email);
        formData.append('phone', appointmentData.phone);
        formData.append('date', appointmentData.date);
        formData.append('gender', appointmentData.gender);
        formData.append('no_of_people', appointmentData.noOfPeople);

        // Append people details
        appointmentData.peopleDetails.forEach((person, index) => {
          formData.append(`people[${index}][name]`, person.name);
          formData.append(`people[${index}][gender]`, person.gender);
          formData.append(`people[${index}][age]`, person.age);
          // Append the proof for each person
          if (appointmentData.proofs[index]) {
            formData.append(`people[${index}][proof]`, appointmentData.proofs[index]);
          }
        });

        // Send the data to the server
        const response = await fetch('http://localhost:5000/api/book-flight', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          setPaymentStatus('Payment successful and flight booked!');
          navigate('/confirmation'); // Redirect to confirmation page
        } else {
          const errorData = await response.json();
          setPaymentStatus(`Error: ${errorData.error}`);
        }
      } catch (error) {
        setPaymentStatus(`Error: ${error.message}`);
      }
    } else {
      setPaymentStatus('Payment failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Payment Page</h2>

      {/* Show passenger details */}
      <h3>Passenger Details</h3>
      <ul>
        <div>
            <div>{appointmentData.name}</div>
            <div>{appointmentData.email}</div>
            <div>{appointmentData.phone}</div>
            <div>{appointmentData.age}</div>
            <div>{appointmentData.gender}</div>
            <div></div>
            <div></div>
        </div>
        {appointmentData.peopleDetails.map((person, index) => (
          <li key={index}>
            <strong>Passenger {index + 1}:</strong>
            <div>Name: {person.name}</div>
            <div>Gender: {person.gender}</div>
            <div>Age: {person.age}</div>
            <div>Proof: {appointmentData.proofs[index] ? appointmentData.proofs[index].name : 'No proof uploaded'}</div>
          </li>
        ))}
      </ul>

      <button onClick={handlePayment}>Complete Payment</button>
      <p>{paymentStatus}</p>
    </div>
  );
};

export default Payment;
