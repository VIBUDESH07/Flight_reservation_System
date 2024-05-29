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
from email.mime.base import MIMEBase
from email import encoders

app = Flask(__name__)
CORS(app)

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
    flight_img = request.files['flightImg']

    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    img_path = os.path.join('uploads', flight_img.filename)
    flight_img.save(img_path)

    binary_img = image_to_binary(img_path)

    connection = connect_to_database()
    if connection:
        cursor = connection.cursor()
        sql_insert_query = """INSERT INTO flight (flight_name, destination, arrival, flight_img, date_time)
                              VALUES (%s, %s, %s, %s, %s)"""
        record_tuple = (flight_name, destination, arrival, binary_img, date_time)
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

    if username == 'admin' and password == 'admin':
        return jsonify({'success': True})
    else:
        return jsonify({'success': False}), 401

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
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM users WHERE google_id = %s", (userid,))
            user = cursor.fetchone()

            if user:
                return jsonify({"success": True})
            else:
                cursor.execute("INSERT INTO users (google_id, email, name) VALUES (%s, %s, %s)", (userid, email, name))
                connection.commit()
                return jsonify({"success": True})

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
        cursor.execute("SELECT flight_name, price FROM flight WHERE id = %s", (flight_id,))
        flight_info = cursor.fetchone()
        if not flight_info:
            return jsonify({"error": "Flight not found"}), 404

        flight_name = flight_info[0]
        price_per_person = flight_info[1]

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

if __name__ == '__main__':
    app.run(debug=True)
