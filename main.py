import sqlite3
from flask import Flask, redirect, url_for, render_template
app=Flask(__name__,template_folder="templates")
@app.route("/")
def base():
    return render_template("Login.html")

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
