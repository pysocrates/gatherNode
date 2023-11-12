// Sanitze gather JSON data. 
// Specify elements to keep at the bottom of file
const fs = require('fs');
const path = require('path');

function sanitizeData(jsonData, entities) {
    // Filter the data
    return jsonData.filter(item => 
        entities.some(entity => item.html.startsWith(entity))
    );
}

function processFilesInDirectory(directory, entities) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error reading the directory:', err);
            return;
        }

        // Filter for JSON files
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        jsonFiles.forEach(file => {
            const filePath = path.join(directory, file);

            // Read each JSON file
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }

                const jsonData = JSON.parse(data);
                const sanitizedData = sanitizeData(jsonData, entities);

                // Save the sanitized data to a new file
                const newFileName = `sanitized_${file}`;
                fs.writeFile(path.join(directory, newFileName), JSON.stringify(sanitizedData, null, 4), err => {
                    if (err) {
                        console.error(`Error writing the sanitized JSON file ${newFileName}:`, err);
                    } else {
                        console.log(`Sanitized data saved to ${newFileName}`);
                    }
                });
            });
        });
    });
}

// Specify the HTML entities you want to keep
const entities = ['<h1', '<h2', '<h3', '<h4', '<h5', '<p', '<div'];

// Directory containing the JSON files
const directory = 'san';

// Process all JSON files in the directory
processFilesInDirectory(directory, entities);
