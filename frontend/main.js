document.getElementById("plotBtn").addEventListener("click", () => {
    const input = document.getElementById("permInput").value;
    const perm = input.split(",").map(Number);
  
    // Basic error handling: filter out NaN
    const cleanedPerm = perm.filter(num => !isNaN(num));
  
    // Plot the permutation using Plotly
    const trace = {
      x: Array.from(cleanedPerm.keys()), // x = indices
      y: cleanedPerm,                    // y = values
      mode: "markers",
      marker: { size: 10 },
      type: "scatter"
    };
  
    Plotly.newPlot("chart", [trace]);
  
    // Call the backend to get the "2413 count"
    fetch("/count_2413", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permutation: cleanedPerm })
    })
    .then(response => response.json())
    .then(data => {
      // Update the countOutput span
      document.getElementById("countOutput").innerText = data.count;
    })
    .catch(err => console.error("Error calling /count_2413:", err));
  });
  