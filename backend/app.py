from flask import Flask, request, jsonify, send_from_directory
from collections import defaultdict
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')

## Counting functions -- not numba so far because doesn't work well on my Mac
def count_elements_to_right(l1, l2):
    l1_set = set(l1)
    right_count = {x: 0 for x in l1_set}
    count = 0
    
    # Traverse l2 from right to left
    for i in reversed(range(len(l2))):
        if l2[i] in l1_set:
            # If l2[i] is in l1, store the current count for that element
            right_count[l2[i]] = count
        elif l2[i] not in l1_set:
            # If l2[i] is not in l1, increment count
            count += 1
    
    # Sum the right counts for each element in l1
    return sum(right_count[x] for x in l1_set)

def n3_fitness(perm):
    smaller = defaultdict(list)
    larger = defaultdict(list)
    for idx, n in enumerate(perm):
        for i in range(idx+1, len(perm)):
            if perm[i] < n:
                smaller[n].append(perm[i])
            else:
                larger[n].append(perm[i])
    
    out = 0
    for s in list(smaller.keys()):
        list1 = smaller[s]
        for l in larger[s]:
            if l in smaller:     
                out += count_elements_to_right(list1, list(smaller[l]))
    return out

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
    count = n3_fitness(permutation)
    return jsonify({"count":count})
                   

# default route to serve front-end from Flask
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

if __name__ == "__main__":
    app.run(debug=True)