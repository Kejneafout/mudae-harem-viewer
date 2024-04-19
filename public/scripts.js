// Initialize global variables
// Default display options
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
	// Set currentPage to maxPage if it goes below one
	if (currentPage <= 0)
	    currentPage = maxPage;
	else
	    currentPage--;
	document.getElementById("currentPage").innerText = currentPage + 1;
	displayData(haremJson, displayOptions);
    });

    // Event listener for the next button
    document.getElementById("embedNext").addEventListener("click", function() {
	// Reset currentPage if it goes above maxPage
	if (currentPage >= maxPage)
	    currentPage = 0;
	else
	    currentPage++;
	document.getElementById("currentPage").innerText = currentPage + 1;
	displayData(haremJson, displayOptions);
    });

    document.addEventListener('keydown', function(event) {
	// Set currentPage to maxPage if it goes below one
	if (event.keyCode === 37) { // Left arrow key
	    if (currentPage <= 0)
		currentPage = maxPage;
	    else
		currentPage--;
	    document.getElementById("currentPage").innerText = currentPage + 1;
	    displayData(haremJson, displayOptions);
	}
	if (event.keyCode === 39) { // Right arrow key
	    // Reset currentPage if it goes above maxPage
	    if (currentPage >= maxPage)
		currentPage = 0;
	    else
		currentPage++;
	    document.getElementById("currentPage").innerText = currentPage + 1;
	    displayData(haremJson, displayOptions);
	}
    });
    
    // Hide the full image div when clicking outside of it
    document.getElementById("overlayDiv").addEventListener("click", function(event) {
	if (event.target === this) {
	    hideFullImage();
	}
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

	currentPage = 0;
	document.getElementById("currentPage").innerText = "1";
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

    var discordImage = document.getElementById("discordImage");
    var haremTitle = document.getElementById("haremTitle");
    var firstMarryImage = document.getElementById("firstMarryImage");
    var characterImage = document.getElementById("characterImage");
    var fullImage = document.getElementById("fullImage");

    if (options.sortBy === "rank") {
        haremJson.characters = sortByRank(data.characters);
    } else if (options.sortBy === "kakera") {
        haremJson.characters = sortByKakera(data.characters);
    } else {
        // Revert to original order
        haremJson.characters = originalOrder.slice();
    }

    if (options.view === "list") {
	// Adjust the margin to avoid line break
	haremContents.style.marginRight = "90px";
	// Show discordImage, haremTitle and firstMarryImage
	discordImage.style.display = "inline";
	haremTitle.style.display = "inline";
	firstMarryImage.style.display = "inline";
	// Hide characterImage
	characterImage.style.display = "none";
	// Change harem title
	haremTitle.textContent = data.metadata.title;
	if (options.show.kakera)
	    displayTotalValue(data.metadata.total);	
	// Calculate the number of pages
	maxPage = Math.ceil(haremJson.characters.length / 15) - 1;
	document.getElementById("maxPage").innerText = maxPage + 1;
	// Take 15 elements from data based on page number
	var chunkStart = 15 * currentPage;
	var chunkEnd = 15 * (currentPage + 1);

	firstMarryImage.src = '/uploads/' + data.characters[0].image;

	const currentChunk = data.characters.slice(chunkStart, chunkEnd);
	currentChunk.forEach(function(item) {
	    var resultsText = document.createElement('span');
	    var resultsContainer = document.createElement('div');

	    let dynamicText = '';

	    if (options.show.rank) {
		dynamicText += `<b>${item.rank}</b> - `;
	    }

	    // If view.series is enabled, set name in bold
	    if (options.show.series)
		dynamicText += `<b>${item.name}</b>`;
	    else
		dynamicText += item.name;

	    if (options.show.note && item.note) {
		dynamicText += ` | ${item.note}`;
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
	// Adjust the margin to avoid empty space
	haremContents.style.marginRight = "10px";
	// Hide discordImage and haremTitle
	discordImage.style.display = "none";
	haremTitle.style.display = "none";
	firstMarryImage.style.display = "none";
	// Show characterImage
	characterImage.style.display = "inline";

        // Calculate the number of pages
        maxPage = haremJson.characters.length - 1;
        document.getElementById("maxPage").innerText = maxPage + 1;

	var resultsText = document.createElement('span');
	var resultsContainer = document.createElement('div');

	let item = data.characters[currentPage];
	let dynamicText = `<b>${item.name}</b><br>`;

	if (options.show.series) {
	    dynamicText += `<br>${item.series}`;
	}
	if (options.show.kakera) {
	    // Split the kakera value
	    let parts = item.value.split(' ');
	    // Display only the number in bold, without ka
	    dynamicText += `<br><b>${parts[0]}</b>`;
	    // Add the kakera icon directly to dynamicText
	    dynamicText += `<img src="assets/kakera.webp" alt="ka" width="18" height="18" style="vertical-align: middle;">`;
    	}

	if (options.show.rank) {
	    dynamicText += `<br>Claim Rank: ${item.rank}`;
	}

	if (options.show.note) {
	    dynamicText += `<br><i>${item.note}</i>`;
	}
	// Append the dynamic text to the results container
	resultsContainer.innerHTML += dynamicText;
	// Append the results container to the harem contents
	haremContents.appendChild(resultsContainer);
	// Load the character image
	characterImage.src = '/uploads/' + data.characters[currentPage].image;
	fullImage.src = characterImage.src;
    }
}

// Function to set the full-size image source and display the overlay
function showFullImage() {
    document.getElementById("overlayDiv").style.display = "block";
}

// Function to hide the full image div
function hideFullImage() {
    document.getElementById("overlayDiv").style.display = "none";
}