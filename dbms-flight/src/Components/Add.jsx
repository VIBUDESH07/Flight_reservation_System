// src/Greeting.js
import React, { Component } from 'react';

class Greeting extends Component {
  state = {
    message: 'Hello, world!',
  };

  updateMessage = () => {
    this.setState({ message: 'You clicked the button!' });
  };

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
        <button onClick={this.updateMessage}>Click me</button>
      </div>
    );
  }
}

export default Greeting;
