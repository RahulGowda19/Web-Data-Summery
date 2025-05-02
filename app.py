from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os
from flask_cors import CORS

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# Serve the main HTML file
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Serve static files (CSS, JS)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/send_email', methods=['POST'])
def send_email():
    try:
        data = request.json
        sender_email = data.get('sender')
        receiver_email = data.get('receiver')
        csv_data = data.get('csv_data')
        
        if not all([sender_email, receiver_email, csv_data]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Create email message
        message = MIMEMultipart("alternative")
        message["Subject"] = "CSV Data Export"
        message["From"] = sender_email
        message["To"] = receiver_email

        # Create the body of the message
        body = "Please find attached the CSV data you requested."
        message.attach(MIMEText(body, "plain"))

        # Attach CSV data
        csv_part = MIMEApplication(csv_data)
        csv_part.add_header('Content-Disposition', 'attachment', filename='data.csv')
        message.attach(csv_part)

        # Send email using Gmail SMTP
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, "GMAIL_APP_PASSWORD")  # Use your app password here
            server.sendmail(sender_email, receiver_email, message.as_string())

        return jsonify({'message': 'Email sent successfully!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
