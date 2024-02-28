// Initialize options object
let haremJson = {};
let displayOptions = {
  view: "list",
  sortBy: "default",
  show: {
    rank: false,
    kakera: false,
    note: false
  }
};

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
		    throw new Error('Failed to upload data to the server');
		}
		return response.json(); // Parse response JSON
	    })
	    .then(data => {
		console.log('Received data:', data);
		// Handle response data as needed
		// Get all elements with the hidden attribute
		const hiddenElements = document.querySelectorAll('[hidden]');

		// Loop through each hidden element and remove the hidden attribute to show them
		hiddenElements.forEach(element => {
		    element.removeAttribute('hidden');
		});
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
	    // Get all elements with the hidden attribute
	    const hiddenElements = document.querySelectorAll('[hidden]');

	    // Loop through each hidden element and remove the hidden attribute to show them
	    hiddenElements.forEach(element => {
		element.removeAttribute('hidden');
	    });

	} catch (error) {
	    console.error('Error fetching data:', error);
	}
    });

    // Get all radio buttons and checkboxes
    const radios = document.querySelectorAll('input[type="radio"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Add event listeners to radios and checkboxes
    radios.forEach(radio => {
	radio.addEventListener('click', (event) => updateOptions(event.target));
    });

    checkboxes.forEach(checkbox => {
	checkbox.addEventListener('click', (event) => updateOptions(event.target));
    });
});

// Function to update displayOptions object
function updateOptions(element) {

    const elementType = element.getAttribute('type');
    const elementName = element.getAttribute('name');
    const elementValue = element.getAttribute('value');
    const isChecked = elementType === 'checkbox' ? element.checked : true;

    if (elementType === 'checkbox') {
	displayOptions.show[elementValue] = isChecked;
    } else {
	displayOptions[elementName] = elementValue;
    }

    console.log('Updated options:', displayOptions);
}

function displayData(data, options) {

}