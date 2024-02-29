// Initialize global variables
displayOptions = {
    view: "list",
    sortBy: "default",
    show: {
	rank: false,
	series: false,
	kakera: false,
	note: false
    }
};
currentPage = 0;

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
		haremJson = data;
		originalOrder = haremJson.characters.slice();

		unhideDivs();
		displayData(haremJson, displayOptions);
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
	    haremJson = jsonData;
	    originalOrder = haremJson.characters.slice();

	    unhideDivs();
	    displayData(haremJson, displayOptions);
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

    // Event listener for the previous button
    document.getElementById("embedPrev").addEventListener("click", function() {
	// Make sure the counter doesn't go below zero
	if (currentPage > 0) {
	    currentPage--;
	    // Do something with the currentPage, for example, update UI
	}
    });

    // Event listener for the next button
    document.getElementById("embedNext").addEventListener("click", function() {
	// Make sure the counter doesn't go above maxPage
	if (currentPage < maxPage) {
	    currentPage++;
	    // Do something with the currentPage, for example, update UI
	}
    });
});

function setPageNumbers(data) {
    // Calculate the number of pages
    maxPage = Math.ceil(haremJson.characters.length / 15) - 1;
}

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

    displayData(haremJson, displayOptions);
}

function unhideDivs() {
    // Get all elements with the hidden attribute
    const hiddenElements = document.querySelectorAll('[hidden]');

    // Loop through each hidden element and remove the hidden attribute to show them
    hiddenElements.forEach(element => {
	element.removeAttribute('hidden');
    });
}

function displayTotalValue(total) {
    var haremContents = document.getElementById('haremContents');
    var resultsContainer = document.createElement('div');
    var resultsText = document.createElement('span');
    var lineBreak = document.createElement('br');

    resultsText.innerHTML = `Total value: <b>${total}</b>`;

    // Add the kakera icon
    var kakeraIcon = document.createElement('img');
    kakeraIcon.src = 'assets/kakera.webp';
    kakeraIcon.alt = 'ka';
    kakeraIcon.width = 18;
    kakeraIcon.height = 18;

    resultsContainer.style.display = 'flex';
    resultsContainer.style.alignItems = 'center';
    resultsContainer.appendChild(resultsText);
    resultsContainer.appendChild(kakeraIcon);

    haremContents.appendChild(resultsContainer);
    haremContents.appendChild(lineBreak);
}

// Sort the array based on the numerical part of the 'rank' property
function sortByRank(data) {
    data.sort((a, b) => {
	// Extract numerical part of rank (remove '#' sign and parse as integer)
	const rankA = parseInt(a.rank.substring(1));
	const rankB = parseInt(b.rank.substring(1));

	return rankA - rankB;
    });

    return (data);
}

// Sort the array based on the numerical part of the 'value' property
function sortByKakera(data) {
    data.sort((a, b) => {
	// Extract numeric values from the strings
	const valueA = parseInt(a.value);
	const valueB = parseInt(b.value);

	return valueB - valueA;
    });

    return (data);
}

function displayData(data, options) {
    // Clear the haremContents div
    let haremContents = document.getElementById("haremContents");
    haremContents.innerHTML = "";

    if (options.view === "list") {
	// Change harem title
	document.getElementById("haremTitle").textContent = data.metadata.title;
	if (options.show.kakera)
	    displayTotalValue(data.metadata.total);	
	// Take 15 elements from data based on page number
	var chunkStart = 15 * currentPage;
	var chunkEnd = 15 * (currentPage + 1);

	if (options.sortBy === "rank") {
	    haremJson.characters = sortByRank(data.characters);
	} else if (options.sortBy === "kakera") {
	    haremJson.characters = sortByKakera(data.characters);
	} else {
	    // Revert to original order
	    haremJson.characters = originalOrder.slice();
	}

	var firstImage = document.getElementById("firstMarryImage");
	firstImage.src = '/uploads/' + data.characters[0].image;

	const currentChunk = data.characters.slice(chunkStart, chunkEnd);
	currentChunk.forEach(function(item) {
	    var resultsText = document.createElement('span');
	    var resultsContainer = document.createElement('div');

	    let dynamicText = '';

	    if (options.show.rank) {
		dynamicText += `<b>${item.rank}</b> - `;
	    }
	    dynamicText += item.name;
	    if (options.show.note === true) {
		dynamicText += ` | <b>${item.note}</b>`;
	    }
	    if (options.show.series) {
		dynamicText += ` - ${item.series}`;
	    }
	    if (options.show.kakera) {
		// Split the kakera value
		let parts = item.value.split(' ');
		// Display only the number in bold, without ka
		dynamicText += ` <b>${parts[0]}</b> ${parts[1]}`;
	    }

	    resultsText.innerHTML = dynamicText;
	    resultsContainer.appendChild(resultsText);
	    haremContents.appendChild(resultsContainer);
	});
    } else {
    }
}