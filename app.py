import sqlite3, os
from flask import Flask, redirect, url_for, render_template, request, session
app=Flask(__name__,template_folder="templates")

# Set a secret key for session management
app.secret_key = os.urandom(24)  # Generates a 24-byte random key

def insert_car_to_db(name, price, engine, mileage, horsepower, image_url):
    """Insert a car's data into the database"""
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('DELETE FROM saved_cars')
    c.execute('''INSERT INTO saved_cars (name, price, engine_type, mileage, horsepower, image_url)
                 VALUES (?, ?, ?, ?, ?, ?)''', (name, price, engine, mileage, horsepower, image_url))
    conn.commit()
    conn.close()

def get_saved_cars_from_db():
    """Retrieve all saved cars from the database"""
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM saved_cars')
    cars = c.fetchall()
    conn.close()
    return cars

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
# Route for the explore page
# @app.route('/explore.html', methods=['GET', 'POST'])
# def explore():
#     if request.method == 'POST':
#         car_name = request.form['carname']
#         car_price = request.form['price']
#         car_engine = request.form['engine']
#         car_mileage = request.form['mileage']
#         car_horsepower = request.form['horsepower']
#         car_image = request.form['car-url']
#         print(car_name,car_price,car_engine,car_mileage,car_horsepower,car_image)
#         # Insert the car data into the database
#         insert_car_to_db(car_name, car_price, car_engine, car_mileage, car_horsepower, car_image)

#     return render_template('explore.html')
@app.route('/explore.html', methods=['GET', 'POST'])
def explore():
    if request.method == 'POST':
        # Print all the form data to debug
        print("Form Data:", request.form)

        try:
            car_name = request.form['carname']
            car_price = request.form['price']
            car_engine = request.form['engine']
            car_mileage = request.form['mileage']
            car_horsepower = request.form['horsepower']
            car_image = request.form['car-url']
        
            # Printing out the received data
            print(f"Car Name: {car_name}")
            print(f"Price: {car_price}")
            print(f"Engine: {car_engine}")
            print(f"Mileage: {car_mileage}")
            print(f"Horsepower: {car_horsepower}")
            print(f"Image URL: {car_image}")

            # Insert car data into the database
            insert_car_to_db(car_name, car_price, car_engine, car_mileage, car_horsepower, car_image)
            return render_template('explore.html', message="Car saved successfully!")
        
        except KeyError as e:
            # Handle missing key error
            return f"Missing form data: {e}", 400

    return render_template('explore.html')

# Route for the saved cars page
@app.route('/save.html')
def save():
    saved_cars = get_saved_cars_from_db()
    return render_template('save.html', saved_cars=saved_cars)

@app.route("/info.html")
def info():
    return render_template("info.html")

@app.route("/filter.html")
def filter():
    return render_template("filter.html")

if __name__=="__main__":
    app.run(port=5500, debug=True)
