from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')

#testing server
@app.route('/hello', methods=['GET'])
def hello():
    return "Hello from the backend."


# route for counting 2413 patterns
@app.route('/count_2413', methods=['POST'])
def count_2413():
    data = request.get_json()
    permutation = data.get('permutation', [])
    #Placeholder - for now just return length of permutation
    count = len(permutation)
    return jsonify({"count":count})
                   

# default route to serve front-end from Flask
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

if __name__ == "__main__":
    app.run(debug=True)