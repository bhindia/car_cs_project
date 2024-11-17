from flask import Flask, redirect, url_for, render_template
app=Flask(__name__,template_folder="templates")
@app.route("/")
def base():
    return render_template("/templates/home.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/explore")
def explore():
    return render_template("explore.html")

@app.route("/info")
def info():
    return render_template("info.html")

@app.route("/filter")
def filter():
    return render_template("filter.html")

@app.route("/save")
def save():
    return render_template("save.html")
if __name__=="__main__":
    app.run(port=5500, debug=True)
