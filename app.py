from flask import Flask, render_template

# Create an instance of Flask
app = Flask(__name__)

# Route
@app.route("/")
def main():
    
    # Redirect back to home page
    return render_template("index.html")  

if __name__ == "__main__":
    app.run(debug=True)