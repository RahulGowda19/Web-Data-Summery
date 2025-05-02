# Data Management Interface

## Project Description

This project provides a web-based interface for managing and processing data from CSV files. It allows users to upload, display, filter, download, and delete data, as well as send data via email.

## Features

* **Upload CSV Data:** Upload CSV files to the application.
* **Display Data:** Display the uploaded data in a tabular format.
* **Filter Data:** Filter data by date and/or restaurant name.
* **Download Data:** Download the displayed or filtered data as a CSV file.
* **Delete Data:** Delete data, with options to filter before deletion.
* **Send Email:** Send the data via email to a specified recipient.

## Technical Details

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python (Flask)
* **Email Handling:** SMTP (using Gmail)
* **Data Processing:** Pandas

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```
2.  **Set up a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```
3.  **Install dependencies:**
    ```bash
    pip install Flask pandas
    ```
4.  **Run the Flask application:**
    ```bash
    python app.py
    ```
5.  **Open the application in your browser:**
    * The application should be running at `http://127.0.0.1:5000/`.

## Important Notes on Email Functionality

* **Gmail App Password:** The application uses a hardcoded Gmail app password (`"otic zjio fzkm bldg"`) for sending emails.  **You MUST replace this with your own Gmail app password** for the email functionality to work.
    * Generate an App Password:
        * Go to your Google Account: `https://myaccount.google.com/`
        * Navigate to "Security".
        * Enable "2-Step Verification" if it's not already enabled.
        * Go to "App passwords".
        * Create a new app password with a descriptive name (e.g., "Data Management App").
        * **Replace the hardcoded password in `app.py` with the generated app password.**

##  File Structure
.├── app.py├── index.html├── script.js└── styles.css* `app.py`: Flask application.  Handles data processing and email sending.
* `index.html`: Main HTML file for the web interface.
* `script.js`: JavaScript file for frontend interactivity.
* `styles.css`: CSS file for styling the web interface.

##  Usage
1.  **Upload Data:** Click "Choose File" to select a CSV file, and then click "Upload CSV".
2.  **Display Data:** Click "Display Data" to show the uploaded data in a table.
3.  **Send Email:**
    * Enter the sender and receiver email addresses.
    * Click "Send Email".
    * Make sure you have correctly configured the Gmail app password in `app.py`.
4.  **Download Data:**
    * Optionally, use the "Filter by Date" and "Filter by Restaurant Name" fields to filter the data.
    * Click "Download Data" to download the data as a CSV file.
5.  **Delete Data:**
     * Optionally, use the "Filter by Date" and "Filter by Restaurant Name" fields to filter the data you want to delete.
    * Click "Delete Data".  A confirmation message will appear.
    * Confirm to delete the data.

##  Potential Improvements
* **Error Handling:** Implement more robust error handling for file uploads, email sending, and data processing.
* **Input Validation:** Add more validation to the email input fields.
* **Frontend UI:** Improve the user interface and user experience.
* **Security:** Implement security best practices, such as input sanitization and secure password handling.  The current hardcoded password is a major security vulnerability.
* **Database Integration:** Persist the uploaded data in a database instead of storing it in memory.
* **Asynchronous Tasks:** Use a task queue (e.g., Celery) to handle email sending and data processing asynchronously.
* **Authentication:** Add user authentication.
