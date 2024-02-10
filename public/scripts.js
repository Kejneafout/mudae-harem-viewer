document.addEventListener('DOMContentLoaded', function() {

    // Upload a new archive
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
	e.preventDefault(); // Prevent default form submission

	// Get the file input element
	var fileInput = document.getElementById('fileInput');

	// Check if a file is selected
	if (fileInput.files.length === 0) {
	    alert('Please select a file to upload');
	    return;
	}

	// Get the first selected file
	var file = fileInput.files[0];

	// Create a FormData object and append the file to it
	var formData = new FormData();
	formData.append('file', file);

	// Send the form data to the server using Fetch API
	fetch('/upload', {
	    method: 'POST',
	    body: formData
	})
	    .then(response => {
		if (!response.ok) {
		    throw new Error('Network response was not ok');
		}
		return response.json(); // Parse response JSON
	    })
	    .then(data => {
		console.log('Received data:', data);
		// Handle response data as needed
	    })
	    .catch(error => {
		console.error('Upload failed:', error);
		// Handle errors
	    });
    });

    // Use existing files in uploads/
    document.getElementById('useExistingData').addEventListener('click', async () => {
	try {
	    const response = await fetch('/uploads/data.json');
	    if (!response.ok) {
		throw new Error('Failed to fetch data');
	    }
	    const jsonData = await response.json();
	    // Do something with jsonData
	    console.log(jsonData);
	} catch (error) {
	    console.error('Error fetching data:', error);
	}
    });
});

/* ChatGPT tips for future reference

// Assuming your array is named 'data'
const data = [...]; // your array here
// Check the length of the array
const arrayLength = data.length;
// Calculate the number of pages
const numberOfPages = Math.ceil(arrayLength / 15);

// Assuming your element has an id of 'myElement'
const element = document.getElementById('myElement');
// To show the element by setting hidden attribute to false
element.hidden = false;
// Alternatively, you can remove the hidden attribute
element.removeAttribute('hidden');

// Assuming your array is named 'data'
const data = [...]; // your array here
// Take the first 15 elements
const firstFifteen = data.slice(0, 15);
// Take the next 15 elements starting from offset 30
const nextFifteen = data.slice(30, 45);

// Assuming your array is named 'data'
const data = [...]; // your array here
// Sort the array based on the numerical part of the 'rank' property
data.sort((a, b) => {
    // Extract numerical part of rank (remove '#' sign and parse as integer)
    const rankA = parseInt(a.rank.substring(1));
    const rankB = parseInt(b.rank.substring(1));
    
    return rankA - rankB;
});

*/
