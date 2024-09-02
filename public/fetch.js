document.addEventListener("DOMContentLoaded", function() {

    // Upload a new archive
    document.getElementById("uploadForm").addEventListener("submit", function(e) {
	e.preventDefault(); // Prevent default form submission

	// Get the file input element
	var fileInput = document.getElementById("fileInput");

	// Check if a file is selected
	if (fileInput.files.length === 0) {
	    alert("Please select a file to upload");
	    return;
	}

	// Get the first selected file
	var file = fileInput.files[0];

	// Create a FormData object and append the file to it
	var formData = new FormData();
	formData.append("file", file);

	// Send the form data to the server using Fetch API
	fetch("/upload", {
	    method: "POST",
	    body: formData
	})
	    .then(response => {
		if (!response.ok) {
		    throw new Error("Failed to upload data to the server");
		}
		return response.json(); // Parse response JSON
	    })
	    .then(data => {
		haremJson = data;
		originalOrder = haremJson.characters.slice();

		series = [];
		// Loop through object and add "series" to array
		originalOrder.forEach((data) => {
		    var includes = series.includes(data.series);
		    if (!includes) {
			series.push(data.series)
			var dropdown = document.getElementById("series");
			var option = document.createElement("option");
			option.value = data.series;
			option.text = data.series;
			dropdown.add(option);
		    }
		});

		unhideDivs();
		displayData(haremJson, displayOptions);
	    })
	    .catch(error => {
		console.error("Upload failed:", error);
		// Handle errors
	    });
    });

    // Use existing files in uploads/
    document.getElementById("useExistingData").addEventListener("click", async () => {
	try {
	    const response = await fetch("/uploads/data.json");
	    if (!response.ok) {
		throw new Error("Failed to fetch data");
	    }
	    const jsonData = await response.json();
	    haremJson = jsonData;
	    originalOrder = haremJson.characters.slice();

	    series = [];
	    // Loop through object and add "series" to array
	    originalOrder.forEach((data) => {
		var includes = series.includes(data.series);
		if (!includes) {
		    series.push(data.series)
		    var dropdown = document.getElementById("series");
		    var option = document.createElement("option");
		    option.value = data.series;
		    option.text = data.series;
		    dropdown.add(option);
		}
	    });

	    unhideDivs();
	    displayData(haremJson, displayOptions);
	} catch (error) {
	    console.error("Error fetching data:", error);
	}
    });
});
