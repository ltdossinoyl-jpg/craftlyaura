const fs = require('fs');
const path = require('path');

const publicImagesDir = path.join(__dirname, 'frontend', 'public', 'images');
const productsJsonPath = path.join(__dirname, 'frontend', 'src', 'data', 'products.json');

const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

products.forEach(product => {
    const slug = product.slug;
    const oldImages = product.images;
    const newImages = [];
    let mainImageSet = false;

    oldImages.forEach((oldPath, index) => {
        // oldPath is something like "/images/1/0.jpg"
        // we need to resolve the absolute path
        const absoluteOldPath = path.join(__dirname, 'frontend', 'public', ...oldPath.split('/'));

        if (fs.existsSync(absoluteOldPath)) {
            const ext = path.extname(oldPath);
            const isMain = oldPath.includes('/0.') || index === 0;
            const suffix = isMain ? 'main' : `alt-${index}`;
            const newFilename = `${slug}-${suffix}${ext}`;

            // Rename file in the same directory for simplicity, or we can keep it in the same ID folder.
            // Let's keep it in the same ID folder.
            const folderUrlPath = oldPath.substring(0, oldPath.lastIndexOf('/'));
            const absoluteNewPath = path.join(__dirname, 'frontend', 'public', ...folderUrlPath.split('/'), newFilename);

            fs.renameSync(absoluteOldPath, absoluteNewPath);
            newImages.push(`${folderUrlPath}/${newFilename}`);
            console.log(`Renamed: ${oldPath} -> ${folderUrlPath}/${newFilename}`);
        } else {
            console.warn(`Warning: File not found: ${absoluteOldPath}`);
            newImages.push(oldPath); // Keep old path if missing
        }
    });

    product.images = newImages;
    product.image = newImages[0] || '/placeholder.jpg';
});

fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2));

// Update backend products.json as well
const backendJsonPath = path.join(__dirname, 'backend', 'products.json');
if (fs.existsSync(backendJsonPath)) {
    fs.writeFileSync(backendJsonPath, JSON.stringify(products, null, 2));
}

console.log('Images renamed and products.json updated successfully!');
