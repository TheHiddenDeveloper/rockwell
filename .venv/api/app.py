from flask import Flask

app = Flask(__name__)  
@app.route('/')
def hello_world():
    return 'Hello, World!'
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
# This is a simple Flask application that returns "Hello, World!" when accessed at the root URL.
# It is set to run in debug mode and listen on all interfaces (0.0.0.0).
# The application can be run by executing this script, and it will start a local web server.
# Make sure to have Flask installed in your virtual environment.

# To run this application, ensure you have Flask installed in your virtual environment.
# You can install Flask using pip:
# pip install Flask 
# After installing Flask, you can run this script, and it will start a web server.
# You can then access the application by navigating to http://localhost:5000 in your web

