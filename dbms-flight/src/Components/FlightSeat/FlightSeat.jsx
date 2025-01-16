import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Grid, Typography, CircularProgress } from '@mui/material';
import availableSeatImage from '../assets/available-seat.png'; // Replace with your image path
import unavailableSeatImage from '../assets/unavailable-seat.png'; // Replace with your image path
import selectedSeatImage from '../assets/selected-seat.png'; // Replace with your image path

const FlightSeat = () => {
  const [flightNum, setFlightNum] = useState('');
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fetch seat details from API
  const fetchSeatDetails = async () => {
    if (!flightNum) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/seats?flight_num=${flightNum}`);
      setSeats(response.data.seats);
    } catch (error) {
      console.error('Error fetching seat details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle seat selection
  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
        Flight Seat Animation
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          label="Enter Flight Number"
          variant="outlined"
          value={flightNum}
          onChange={(e) => setFlightNum(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={fetchSeatDetails} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Seats'}
        </Button>
      </Box>
      <Grid container spacing={2} justifyContent="center">
        {seats.map((seat, index) => (
          <Grid item xs={4} sm={2} md={1} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.1)' },
              }}
              onClick={() => handleSeatClick(seat.seat_number)}
            >
              <img
                src={
                  selectedSeats.includes(seat.seat_number)
                    ? selectedSeatImage
                    : seat.available
                    ? availableSeatImage
                    : unavailableSeatImage
                }
                alt={`Seat ${seat.seat_number}`}
                style={{ width: '60px', height: '60px' }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {seat.seat_number}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FlightSeat;
