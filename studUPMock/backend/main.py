
from flask import Flask, jsonify
from flask_cors import CORS
from functions import my_function

app = Flask(__name__)
CORS(app)

@app.route("/api/result")
def result():
    return jsonify({
        "result": my_function()
    })

if __name__ == "__main__":
    app.run(debug=True)