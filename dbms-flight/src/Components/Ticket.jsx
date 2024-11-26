import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const Ticket = () => {
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState('');

  // Fetch booking details based on the booking ID
  const fetchBookingDetails = async (booking_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/booking/${booking_id}`);
      const data = await response.json();

      if (data.success) {
        setBookingDetails(data.booking);
        setError('');
      } else {
        setError('No booking found for this ID');
        setBookingDetails(null);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Error fetching booking details');
    }
  };

  // Handle PDF download
  const downloadPDF = () => {
    const doc = new jsPDF();
    if (bookingDetails) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);

      // Set margins for the PDF
      const margin = 15;
      const lineHeight = 8;
      const startX = margin;
      let startY = margin;

      // Add a header for the ticket
      doc.setFontSize(18);
      doc.text('Ticket Confirmation', startX, startY);
      startY += lineHeight * 2;

      // Add booking status
      doc.setFontSize(12);
      doc.text('Status: Booked', startX, startY);
      startY += lineHeight;

      // Add booking details
      doc.text(`Booking ID: ${bookingDetails.booking_id}`, startX, startY);
      startY += lineHeight;
      doc.text(`Name: ${bookingDetails.name}`, startX, startY);
      startY += lineHeight;
      doc.text(`Flight: ${bookingDetails.flight_name}`, startX, startY);
      startY += lineHeight;
      doc.text(`Destination: ${bookingDetails.destination}`, startX, startY);
      startY += lineHeight;
      doc.text(`Arrival: ${bookingDetails.arrival}`, startX, startY);
      startY += lineHeight;
      doc.text(`Date: ${bookingDetails.date}`, startX, startY);
      startY += lineHeight;

      // Add price and number of people
      doc.text(`Price: $${bookingDetails.price}`, startX, startY);
      startY += lineHeight;
      doc.text(`Number of People: ${bookingDetails.num_people}`, startX, startY);
      startY += lineHeight;

      // Footer with company name or contact info (if any)
      doc.setFontSize(10);
      doc.text('Thank you for choosing our service. Contact us at support@example.com', startX, startY + 20);

      // Save the PDF with the booking ID in the filename
      doc.save(`Booking_${bookingDetails.booking_id}.pdf`);
    }
  };

  // Handle form submit to fetch booking details
  const handleSubmit = (event) => {
    event.preventDefault();
    if (bookingIdInput.trim()) {
      fetchBookingDetails(bookingIdInput); // Fetch booking details when form is submitted
    }
  };

  return (
    <div>
      <h2>Enter Booking ID to Fetch Details</h2>

      {/* Form to input booking ID */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Booking ID"
          value={bookingIdInput}
          onChange={(e) => setBookingIdInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {bookingDetails ? (
        <div>
          <h3>Booking Details</h3>
          <p><strong>Booking ID:</strong> {bookingDetails.booking_id}</p>
          <p><strong>Name:</strong> {bookingDetails.name}</p>
          <p><strong>Flight Name:</strong> {bookingDetails.flight_name}</p>
          <p><strong>Destination:</strong> {bookingDetails.destination}</p>
          <p><strong>Arrival:</strong> {bookingDetails.arrival}</p>
          <p><strong>Date:</strong> {bookingDetails.date}</p>
          <p><strong>Price:</strong> ${bookingDetails.price}</p>
          <p><strong>Number of People:</strong> {bookingDetails.no_of_people}</p>

          {/* Button to download as PDF */}
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      ) : (
        <p>{bookingDetails === null ? 'Please enter a booking ID to view details.' : 'Loading booking details...'}</p>
      )}
    </div>
  );
};

export default Ticket;
