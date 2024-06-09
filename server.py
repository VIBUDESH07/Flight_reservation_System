import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import base64
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_mail import Mail, Message
import secrets
import random
from flask import redirect, url_for

secret= secrets.token_hex(16)  # Generates a 32-character hexadecimal string (16 bytes)



app = Flask(__name__)
CORS(app)
app.secret_key = secret

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'vibudeshrb.22cse@kongu.edu'
app.config['MAIL_PASSWORD'] = 'andx xznk qhsn aagi' 
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

GOOGLE_CLIENT_ID = '449899539300-fijo74rftd3ih5v8tpi98pd2jcjvurfq.apps.googleusercontent.com'

def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='dbms_flight',
            user='root',
            password='1234'
        )
        if connection.is_connected():
            return connection
        else:
            return None
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

def image_to_binary(image_path):
    with open(image_path, 'rb') as file:
        binary_data = file.read()
    return binary_data
 
@app.route('/api/add-flight', methods=['POST'])
def add_flight():
    flight_name = request.form['flightName']
    destination = request.form['destination']
    arrival = request.form['arrival']
    date_time = request.form['dateTime']
    no_of_seats = request.form['noOfSeats']
    email = request.form['email']
    flight_img = request.files['flightImg']
    price= request.form['price']

    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    img_path = os.path.join('uploads', flight_img.filename)
    flight_img.save(img_path)

    binary_img = image_to_binary(img_path)

    connection = connect_to_database()
    if connection:
        cursor = connection.cursor()
        sql_insert_query = """INSERT INTO flight (flight_name, destination, arrival, flight_img, date_time, no_of_seats, email,price)
                              VALUES (%s, %s, %s, %s, %s, %s, %s,%s)"""
        record_tuple = (flight_name, destination, arrival, binary_img, date_time, no_of_seats, email,price)
        cursor.execute(sql_insert_query, record_tuple)
        connection.commit()
        connection.close()

        return jsonify({"message": "Flight details inserted successfully"}), 201
    else:
        return jsonify({"message": "Failed to connect to database"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    try:
        connection = connect_to_database()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM login WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()

        if user:
            return jsonify({'success': True, 'role': user['role'], 'email':user['email']})
        else:
            return jsonify({'success': False}), 401

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/google-login', methods=['POST'])
def google_login():
    token = request.json.get('token')
    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        userid = idinfo['sub']
        email = idinfo.get('email')
        name = idinfo.get('name')

        connection = connect_to_database()
        if connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE google_id = %s", (userid,))
            user = cursor.fetchone()

            if user:
                return jsonify({"success": True, "role": user['role']})
            else:
                cursor.execute("INSERT INTO users (google_id, email, name, role) VALUES (%s, %s, %s, 'passenger')", (userid, email, name))
                connection.commit()
                return jsonify({"success": True, "role": 'passenger'})

    except ValueError:
        return jsonify({"success": False}), 400
    except Exception as e:
        print(e)
        return jsonify({"success": False}), 500

@app.route('/api/flight-data', methods=['POST'])
def get_flight_data():
    data = request.json
    from_value = data.get('from')
    to_value = data.get('to')

    try:
        connection = connect_to_database()
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT id, flight_name, price, no_of_seats, destination, arrival, date_time, 
               CAST(TO_BASE64(flight_img) AS CHAR) AS flight_img_base64
        FROM flight
        WHERE destination = %s AND arrival = %s
        """
        cursor.execute(query, (from_value, to_value))
        flight_data = cursor.fetchall()

        return jsonify(flight_data)

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def send_email(to_email, subject, message):
    from_email = 'vibudeshrb.22cse@kongu.edu'
    password = 'andx xznk qhsn aagi'

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(from_email, password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
    except Exception as e:
        print(f"Failed to send email: {e}")
@app.route('/api/cancel-booking', methods=['POST'])
def cancel_booking():
    data = request.json
    booking_id = data.get('bookingId')
    flight_id = data.get('flightId')
    no_of_people = data.get('noOfPeople')

    if not booking_id or not flight_id or not no_of_people:
        return jsonify({'error': 'Invalid data'}), 400

    try:
        connection = connect_to_database()
        cursor = connection.cursor()

        # Delete the booking
        cursor.execute("DELETE FROM passengers WHERE id = %s", (booking_id,))
        
        # Update the number of seats
        cursor.execute("UPDATE flight SET no_of_seats = no_of_seats + %s WHERE id = %s", (no_of_people, flight_id))

        connection.commit()
        return jsonify({'success': True})
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/book-flight', methods=['POST'])
def book_flight():
    flight_id = request.form['flight_id']
    name = request.form['name']
    email = request.form['email']
    phone = request.form['phone']
    date = request.form['date']
    gender = request.form['gender']
    no_of_people = int(request.form['no_of_people'])
    people_genders = request.form['people_genders']
    proof = request.files['proof']

    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    proof_path = os.path.join('uploads', proof.filename)
    proof.save(proof_path)

    try:
        connection = connect_to_database()
        cursor = connection.cursor()

        # Check the current number of seats
        cursor.execute("SELECT no_of_seats FROM flight WHERE id = %s", (flight_id,))
        result = cursor.fetchone()
        if not result:
            return jsonify({"error": "Flight not found"}), 404

        no_of_seats = result[0]
        if no_of_seats < no_of_people:
            return jsonify({"error": "Not enough seats available"}), 400

        # Fetch flight name and price
        cursor.execute("SELECT flight_name, price, email FROM flight WHERE id = %s", (flight_id,))
        flight_info = cursor.fetchone()
        if not flight_info:
            return jsonify({"error": "Flight not found"}), 404

        flight_name = flight_info[0]
        price_per_person = flight_info[1]
        from1 = flight_info[2]
        # Calculate total price
        total_price = int(price_per_person) * int(no_of_people)

        # Update the number of seats
        cursor.execute("UPDATE flight SET no_of_seats = no_of_seats - %s WHERE id = %s", (no_of_people, flight_id))
        
        # Insert passenger details
        cursor.execute(
            "INSERT INTO passengers (flight_id, name, email, phone, date, gender, no_of_people, people_genders, proof, price) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (flight_id, name, email, phone, date, gender, no_of_people, people_genders, proof_path, total_price)
        )

        connection.commit()
        cursor.close()
        connection.close()

        # Send email confirmation
        subject = "Flight Booking Confirmation"
        message = f"Dear {name},\n\nYour flight booking is confirmed.\n\nDetails:\nFlight Name: {flight_name}\nTotal Price: {total_price}\nDate: {date}\nNumber of People: {no_of_people}\nGender: {gender}\nEmail: {email}\nPhone: {phone}\n\nThank you for booking with us."
        send_email(email, subject, message)

        return jsonify({"message": "Flight booked successfully"}), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings_by_email():
    email = request.args.get('email')
    print(email)
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    try:
        connection = connect_to_database()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM passengers WHERE email = %s", (email,))
        bookings = cursor.fetchall()

        for booking in bookings:
            booking['id'] = str(booking['id'])

        return jsonify(bookings)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/flight-detail-admin', methods=['GET'])
def get_details():
    # Your existing code to fetch flight details from the database

    try:
        connection = connect_to_database()
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT id, flight_name, price, no_of_seats, destination, arrival, date_time, 
               CAST(TO_BASE64(flight_img) AS CHAR) AS flight_img_base64
        FROM flight
        """
        cursor.execute(query)
        flight_data = cursor.fetchall()

        return jsonify(flight_data), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


def generate_otp():
    # Generate a 6-digit random OTP
    return ''.join(random.choices('0123456789', k=6))


otp_storage = {}

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

   
    otp = generate_otp()

    # Store OTP in otp_storage
    otp_storage[email] = otp
    print(otp_storage)
    # Send OTP via email
    try:
        msg = Message('OTP for Verification', sender='vibudeshrb.22cse@kongu.edu', recipients=[email])  # Replace with your Gmail address
        msg.body = f'Your OTP for verification is: {otp}'
        mail.send(msg)
        return jsonify({'success': True, 'message': 'OTP sent successfully'})
    except Exception as e:
        print(f"Failed to send OTP: {e}")
        return jsonify({'error': 'Failed to send OTP'}), 500
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    otp = data.get('otp')

    print(email,username,password,role)
    verification_result = verify_otp(email, otp)
    print(verification_result)
    if not verification_result['success']:
        return jsonify({"success": False, "message": verification_result['message']}), 400

    try:
        connection = connect_to_database()
        cursor = connection.cursor()

        # Insert new user
        cursor.execute("INSERT INTO login (username, email, password, role) VALUES (%s, %s, %s, %s)", (username, email, password, role))
        connection.commit()

        return jsonify({"success": True, "message": "Signup successful"}), 200

    except Error as e:
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def verify_otp(email, otp):
    if not email or not otp:
        return {'success': False, 'message': 'Email and OTP are required'}
    print(email,otp,otp_storage)
    # Check if the OTP matches
    if email in otp_storage and otp_storage[email] == otp:
       
        return {'success': True, 'message': 'OTP verified successfully'}
    else:
        return {'success': False, 'message': 'Invalid OTP'}

@app.route('/api/update-flt/<int:flight_id>', methods=['GET', 'PUT'])
def update_flight(flight_id):
    if request.method == 'GET':
        try:
            connection = connect_to_database()
            if connection:
                cursor = connection.cursor(dictionary=True)
                cursor.execute("SELECT flight_name, price, no_of_seats, destination, arrival, date_time, email, TO_BASE64(flight_img) AS flight_img_base64 FROM flight WHERE id = %s", (flight_id,))
                flight = cursor.fetchone()
                cursor.close()
                connection.close()
                if flight:
                    return jsonify(flight), 200
                else:
                    return jsonify({"error": "Flight not found"}), 404
            else:
                return jsonify({"error": "Failed to connect to the database"}), 500
        except Error as e:
            return jsonify({"error": str(e)}), 500
    elif request.method == 'PUT':
        try:
            updated_flight_details = request.json

            connection = connect_to_database()
            if connection:
                cursor = connection.cursor()

                sql_update_query = """
                UPDATE flight
                SET flight_name = %s, destination = %s, arrival = %s, date_time = %s,
                    no_of_seats = %s, email = %s, price = %s
                WHERE id = %s
                """
                cursor.execute(sql_update_query, (
                    updated_flight_details.get('flightName'),
                    updated_flight_details.get('destination'),
                    updated_flight_details.get('arrival'),
                    updated_flight_details.get('dateTime'),
                    updated_flight_details.get('noOfSeats'),
                    updated_flight_details.get('email'),
                    updated_flight_details.get('price'),
                    flight_id
                ))

                connection.commit()
                cursor.close()
                connection.close()

                return jsonify({"message": "Flight details updated successfully"}), 200
            else:
                return jsonify({"error": "Failed to connect to the database"}), 500
        except Error as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
