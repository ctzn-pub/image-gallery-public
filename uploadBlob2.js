const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

// Set your token here
const token = "vercel_blob_rw_ZhdyA7KaXd4xLt9Y_vL3s3SlrRYGloIgJmsONtDykcQFRPg"

async function uploadFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        const blob = await put(fileName, fileContent, {
            access: 'public', // or 'private'
            token: token
        });

        return blob.url;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}

async function processFiles(jsonPath) {
    const fileData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const uploadedUrls = [];

    for (const filePath of fileData.files) {
        const url = await uploadFile(filePath);
        if (url) {
            uploadedUrls.push({ filePath: filePath, url: url });
            console.log('File uploaded:', url);
        }
    }

    // Output to JSON file
    fs.writeFileSync('uploaded_urls.json', JSON.stringify(uploadedUrls, null, 2));
    console.log('All files processed. URLs saved to uploaded_urls.json');
}

// Replace 'path/to/your/file.json' with the path to your JSON file
processFiles('uploadimages.json');
