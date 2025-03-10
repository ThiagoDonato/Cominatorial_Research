let selectedPoints = [];  // store indices of selected points

document.getElementById("plotBtn").addEventListener("click", () => {
    const input = document.getElementById("permInput").value;
    const perm = input.split(",").map(Number);
    const cleanedPerm = perm.filter(num => !isNaN(num));

    // Store permutation globally so we can modify it after swaps
    window.currentPermutation = cleanedPerm;

    plotPermutation(cleanedPerm);
});

// Function to plot the permutation and add click interactivity
function plotPermutation(perm) {
    const trace = {
        x: Array.from(perm.keys()),
        y: perm,
        mode: "markers",
        marker: { size: 15, color: "dark blue" },
        type: "scatter"
    };

    const layout = {
        width: 500,
        height: 500,
        margin: { l: 20, r: 20, t: 20, b: 20 },
    };

    Plotly.newPlot("chart", [trace], layout).then((graph) => {
        graph.on("plotly_click", function(data) {
            const clickedIndex = data.points[0].x;  // Get index of clicked point
            handlePointSelection(clickedIndex);
        });
    });

    // Update the 2413 count after plotting
    updateFitnessCount(perm);
}

// Handle point selection and swapping
function handlePointSelection(index) {
    if (selectedPoints.length === 0) {
        selectedPoints.push(index);
    } else if (selectedPoints.length === 1 && selectedPoints[0] !== index) {
        selectedPoints.push(index);
        swapPoints(selectedPoints[0], selectedPoints[1]);
        selectedPoints = []; // Reset selection after swap
    }
}

// Swap two points and re-plot
function swapPoints(index1, index2) {
    let perm = window.currentPermutation;
    [perm[index1], perm[index2]] = [perm[index2], perm[index1]];  // Swap
    plotPermutation(perm);  // Re-plot with new permutation
}

// Fetch the updated 2413 count
function updateFitnessCount(perm) {
    fetch("/count_2413", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permutation: perm })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("countOutput").innerText = data.count;
    })
    .catch(err => console.error("Error calling /count_2413:", err));
}
