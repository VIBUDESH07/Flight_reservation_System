import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Styles/Payment.css'; // Import the CSS file
import { QRCodeCanvas } from 'qrcode.react'; // For QR code generation

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
        // Outbound flight booking
        const outboundFormData = new FormData();
        outboundFormData.append('name', appointmentData.name);
        outboundFormData.append('email', appointmentData.email);
        outboundFormData.append('phone', appointmentData.phone);
        outboundFormData.append('date', appointmentData.formattedDate);
        outboundFormData.append('gender', appointmentData.gender);
        outboundFormData.append('no_of_people', appointmentData.noOfPeople);
        outboundFormData.append('flight_id', appointmentData.flight_id);

        appointmentData.peopleDetails.forEach((person, index) => {
          outboundFormData.append(`people[${index}][name]`, person.name);
          outboundFormData.append(`people[${index}][gender]`, person.gender);
          outboundFormData.append(`people[${index}][age]`, person.age);
          if (appointmentData.proofs[index]) {
            outboundFormData.append(`people[${index}][proof]`, appointmentData.proofs[index]);
          }
        });

        const outboundResponse = await fetch('http://localhost:5000/api/book-flight', {
          method: 'POST',
          body: outboundFormData,
        });

        if (outboundResponse.ok) {

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
              navigate('/confirmation');
            } else {
              const errorData = await returnResponse.json();
              setPaymentStatus(`Return trip error: ${errorData.error}`);
            }
          } else {
            setPaymentStatus('Payment successful and outbound flight booked!');
            navigate('/confirmation');
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
    <div className="payment-container">
      <div className="payment-box">
        <h1 className="payment-header">Complete Your Payment</h1>

        {/* Passenger Details */}
        <div className="details-section">
          <h2 className="details-title">Passenger Details</h2>
          <div className="details-grid">
            <div><span>Name:</span> {appointmentData.name}</div>
            <div><span>Email:</span> {appointmentData.email}</div>
            <div><span>Phone:</span> {appointmentData.phone}</div>
            <div><span>Gender:</span> {appointmentData.gender}</div>
            <div><span>Price:</span> {appointmentData.price}</div>
          </div>
        </div>

        {/* Passenger List */}
        <div className="details-section">
          <h2 className="details-title">Passenger List</h2>
          {appointmentData.peopleDetails.map((person, index) => (
            <div key={index} className="passenger-card">
              <strong>Passenger {index + 1}</strong>
              <p>Name: {person.name}</p>
              <p>Gender: {person.gender}</p>
              <p>Age: {person.age}</p>
              <p>Proof: {appointmentData.proofs[index]?.name || 'No proof uploaded'}</p>
            </div>
          ))}
        </div>

        {/* QR Code */}
        <div className="qr-code">
          <QRCodeCanvas
            value={JSON.stringify(appointmentData)} // Generates a QR code based on the appointment data
            size={150}
          />
          <p>Scan the QR code for payment</p>
        </div>

        {/* Payment Button */}
        <button className="payment-btn" onClick={handlePayment}>
          Confirm Payment
        </button>

        {/* Payment Status */}
        {paymentStatus && (
          <p className={`payment-status ${paymentStatus.includes('successful') ? 'text-success' : 'text-error'}`}>
            {paymentStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default Payment;
