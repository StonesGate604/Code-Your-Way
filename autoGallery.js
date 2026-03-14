const fs = require('fs');
const path = require('path');

// Scan gallery_img folder and auto-generate galleryData.js
const galleryImgDir = path.join(__dirname, 'gallery_img');

// Ensure the folder exists
if (!fs.existsSync(galleryImgDir)) {
    fs.mkdirSync(galleryImgDir);
    console.log('✓ Created gallery_img folder');
}

// Supported image formats
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Read all images from the folder
const files = fs.readdirSync(galleryImgDir)
    .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
    })
    .sort();

// Generate image data
const images = files.map((file, index) => {
    return `    { id: ${index}, url: 'gallery_img/${file}', title: 'Artwork ${index + 1}' }`;
});

// Generate JavaScript code
const jsContent = `// Auto-generated gallery image data configuration
// Generated at: ${new Date().toLocaleString('en-US')}
// 
// Usage:
// 1. Put images in the gallery_img folder
// 2. Run in terminal: node autoGallery.js
// 3. Auto-generate this file, the page will display new images

const GALLERY_IMAGES = [
${images.join(',\n')}
];
`;

// Write to galleryData.js
fs.writeFileSync(path.join(__dirname, 'galleryData.js'), jsContent);

console.log(`✓ Successfully generated galleryData.js`);
console.log(`✓ Loaded ${files.length} images`);
if (files.length > 0) {
    console.log(`✓ Image list:`);
    files.forEach((file, i) => {
        console.log(`  ${i + 1}. ${file}`);
    });
} else {
    console.log(`⚠ No images found, please put images in the gallery_img folder`);
}
