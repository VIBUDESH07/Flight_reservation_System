// src/Greeting.js
import React, { Component } from 'react';
import '../Styles/Greetings.css'; // Import CSS for animations

class Greeting extends Component {
  state = {
    message: 'Payment Successful! Your ticket has been booked.',
  };

  render() {
    return (
      <div className="success-message">
        <h1>{this.state.message}</h1>
        <p>Your flight details will be sent to your email shortly.</p>
        <div className="animation">
          {/* You can add an image or icon here */}
          <span role="img" aria-label="airplane">✈️</span>
        </div>
      </div>
    );
  }
}

export default Greeting;
