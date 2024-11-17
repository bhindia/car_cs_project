import sqlite3
from flask import Flask, redirect, url_for, render_template, request
app=Flask(__name__,template_folder="templates")

@app.route("/")
def base():
    return render_template("login.html")

# Function to verify login credentials from the database
def check_login_credentials(username, password):
    connection = sqlite3.connect('database.db')  # Connect to the database
    cursor = connection.cursor()

    # Query the database to find the user by username and password
    cursor.execute("SELECT * FROM login WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()  # Fetch the first matching row

    connection.close()

    # If a user is found, return True (valid login), else return False
    return user is not None

@app.route('/login.html', methods=['POST'])
def handle_login():
    username = request.form.get('username')
    password = request.form.get('password')

    # Check the credentials in the database
    if check_login_credentials(username, password):
        return redirect(url_for('home'))  # Redirect to the home page on successful login
    else:
        return "Invalid credentials, please try again."
    
@app.route("/home.html")
def home():
    return render_template("home.html")

@app.route("/explore.html")
def explore():
    return render_template("explore.html")

@app.route("/info.html")
def info():
    return render_template("info.html")

@app.route("/filter.html")
def filter():
    return render_template("filter.html")

@app.route("/save.html")
def save():
    return render_template("save.html")
if __name__=="__main__":
    app.run(port=5500, debug=True)
