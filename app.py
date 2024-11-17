import sqlite3, os
from flask import Flask, redirect, url_for, render_template, request, session
app=Flask(__name__,template_folder="templates")

# Set a secret key for session management
app.secret_key = os.urandom(24)  # Generates a 24-byte random key

@app.route("/")
def base():
    # Check if user is logged in
    if 'logged_in' in session:
        return render_template('home.html', username=session['username'])
    else:
        return redirect(url_for('login'))

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

@app.route('/login.html', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Check if the credentials match the stored ones (or fetch from DB)
        if check_login_credentials(username, password):
            session['logged_in'] = True
            session['username'] = username  # Store username in session
            return redirect(url_for('home'))
        else:
            return "Invalid username or password", 401

    return render_template('login.html')

@app.route('/logout.html')
def logout():
    # Clear the session to log out
    session.pop('logged_in', None)
    session.pop('username', None)
    
    # Render the logout confirmation page
    return render_template('logout.html')

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
