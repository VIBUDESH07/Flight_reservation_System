import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentData = location.state;
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = async () => {
    const paymentSuccessful = true; // Simulated payment status
    console.log(appointmentData);
  
    if (paymentSuccessful) {
      try {
        // Create and populate FormData for the outbound flight
        const outboundFormData = new FormData();
        outboundFormData.append('name', appointmentData.name);
        outboundFormData.append('email', appointmentData.email);
        outboundFormData.append('phone', appointmentData.phone);
        outboundFormData.append('date', appointmentData.formattedDate);
        outboundFormData.append('gender', appointmentData.gender);
        outboundFormData.append('no_of_people', appointmentData.noOfPeople);
        outboundFormData.append('flight_id', appointmentData.flight_id);
  
        // Append people details
        appointmentData.peopleDetails.forEach((person, index) => {
          outboundFormData.append(`people[${index}][name]`, person.name);
          outboundFormData.append(`people[${index}][gender]`, person.gender);
          outboundFormData.append(`people[${index}][age]`, person.age);
          if (appointmentData.proofs[index]) {
            outboundFormData.append(`people[${index}][proof]`, appointmentData.proofs[index]);
          }
        });
      
        // Outbound flight booking
        const outboundResponse = await fetch('http://localhost:5000/api/book-flight', {
          method: 'POST',
          body: outboundFormData,
        });
  
        if (outboundResponse.ok) {
          // Handle return flight booking only if f_id is present
          if (appointmentData.f_id) {
            const returnFormData = new FormData();
            returnFormData.append('name', appointmentData.name);
            returnFormData.append('email', appointmentData.email);
            returnFormData.append('phone', appointmentData.phone);
            returnFormData.append('date', appointmentData.formattedDate);
            returnFormData.append('gender', appointmentData.gender);
            returnFormData.append('no_of_people', appointmentData.noOfPeople);
            returnFormData.append('flight_id', appointmentData.f_id);
  
            appointmentData.peopleDetails.forEach((person, index) => {
              returnFormData.append(`people[${index}][name]`, person.name);
              returnFormData.append(`people[${index}][gender]`, person.gender);
              returnFormData.append(`people[${index}][age]`, person.age);
              if (appointmentData.proofs[index]) {
                returnFormData.append(`people[${index}][proof]`, appointmentData.proofs[index]);
              }
            });
  
            const returnResponse = await fetch('http://localhost:5000/api/book-flight', {
              method: 'POST',
              body: returnFormData,
            });
  
            if (returnResponse.ok) {
              setPaymentStatus('Payment successful and round-trip flights booked!');
              navigate('/confirmation'); // Redirect to confirmation page
            } else {
              const errorData = await returnResponse.json();
              setPaymentStatus(`Return trip error: ${errorData.error}`);
            }
          } else {
            setPaymentStatus('Payment successful and outbound flight booked!');
            navigate('/confirmation'); // Redirect for one-way booking
          }
        } else {
          const errorData = await outboundResponse.json();
          setPaymentStatus(`Outbound trip error: ${errorData.error}`);
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
      <h3>Passenger Details</h3>
      <div>
        <div>Name : {appointmentData.name}</div>
        <div>Email : {appointmentData.email}</div>
        <div>Phone : {appointmentData.phone}</div>
        <div>Gender : {appointmentData.gender}</div>
        <div>Price : {appointmentData.price}</div>
      </div>
      <ul>
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
