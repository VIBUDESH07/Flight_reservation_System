

# Flight Reservation System

**Flight Reservation System** is a comprehensive web application designed to manage and streamline the process of booking flights. Built using React for the frontend, Flask for the backend, and MySQL as the database, this system allows users to search for flights, book tickets, and manage reservations with ease.

## Features

- **User Authentication**: Secure user authentication for customers to sign up, log in, and manage their flight bookings.
- **Flight Search**: Allows users to search for flights based on departure and arrival locations, dates, and other criteria.
- **Booking Management**: Users can book flights, view their booking history, and cancel reservations.
- **Admin Dashboard**: An admin panel for managing flights, schedules, and user reservations.
- **Payment Integration**: Integration with payment gateways to handle online payments for flight bookings.
- **Responsive Design**: Fully responsive interface ensuring a seamless experience on both desktop and mobile devices.

## Tech Stack

- **React.js**: Frontend library for building dynamic user interfaces and handling state management.
- **Flask**: Python web framework used for creating RESTful APIs that interact with the frontend.
- **MySQL**: Relational database for storing user data, flight information, bookings, and transactions.
- **CSS**: Custom styling to maintain a clean and user-friendly design.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/flight-reservation-system.git
    ```
2. **Navigate to the project directory**:
    ```bash
    cd flight-reservation-system
    ```
3. **Backend Setup**:
    - Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    - Set up the MySQL database:
      - Create a new MySQL database.
      - Update the database configuration in the Flask app with your MySQL credentials.
      - Run the migrations to create the necessary tables:
      ```bash
      flask db upgrade
      ```
    - Start the Flask server:
    ```bash
    flask run
    ```

4. **Frontend Setup**:
    - Navigate to the frontend directory:
    ```bash
    cd client
    ```
    - Install npm dependencies:
    ```bash
    npm install
    ```
    - Start the React development server:
    ```bash
    npm start
    ```

5. **Access the application**:
    - Open your browser and go to `http://localhost:3000` to start using the application.

## Usage

- **Customers**: Search for flights, book tickets, and manage your reservations through an intuitive interface.
- **Admins**: Log in to the admin panel to manage flight schedules, monitor bookings, and handle user queries.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the open-source community for providing valuable resources and libraries that made this project possible.
- Inspired by the need for an efficient and user-friendly flight booking system.
