import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)

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

    # Ensure the uploads directory exists
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

if __name__ == '__main__':
    app.run(debug=True)
