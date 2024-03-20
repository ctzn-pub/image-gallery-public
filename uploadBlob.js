const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
// Set your token here (or you can use process.env.BLOB_READ_WRITE_TOKEN if set as an env variable)
const token = "vercel_blob_rw_ZhdyA7KaXd4xLt9Y_vL3s3SlrRYGloIgJmsONtDykcQFRPg"

async function uploadFile(filePath) {
    const fs = require('fs');

    try {
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        const blob = await put(fileName, fileContent, {
            access: 'public', // or 'private' depending on your requirement
            token: token
        });

        console.log('File uploaded:', blob.url);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

// Replace 'path/to/your/file.txt' with the path to the file you want to upload
uploadFile('/Users/umahuggins/Projects/t/data_sources/playwright/image_collection/Painted Peacock Duvet Cover & Shams/image4.jpg');
