document.addEventListener('DOMContentLoaded', function() {
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
    
    // Send the form data to the server using Fetch API or XMLHttpRequest
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
});