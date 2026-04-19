const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const FRONTEND_PUBLIC_IMAGES = path.join(__dirname, '../frontend/public/images/products');
const BACKEND_DB_PAGES = path.join(__dirname, 'products.json');
const FRONTEND_DB_PAGES = path.join(__dirname, '../frontend/src/data/products.json');

// Ensure image dir exists
if (!fs.existsSync(FRONTEND_PUBLIC_IMAGES)) {
    fs.mkdirSync(FRONTEND_PUBLIC_IMAGES, { recursive: true });
}

function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(destPath)) {
            // Already downloaded
            resolve();
            return;
        }

        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // handle redirect
                return downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlinkSync(destPath);
            reject(err);
        });
    });
}

async function processProducts() {
    console.log('Loading products.json...');
    const rawData = fs.readFileSync(BACKEND_DB_PAGES, 'utf8');
    const products = JSON.parse(rawData);

    let imageCounter = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        // Process main image
        if (product.image && product.image.includes('cdn.shopify.com')) {
            try {
                const parsedUrl = new URL(product.image);
                // get the filename ignoring query params
                let filename = path.basename(parsedUrl.pathname);
                // Sanitize filename
                filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');

                const localPath = `/images/products/${filename}`;
                const destPath = path.join(FRONTEND_PUBLIC_IMAGES, filename);

                console.log(`Downloading (${i + 1}/${products.length}): ${filename}`);
                await downloadImage(product.image, destPath);

                // Update JSON
                product.image = localPath;
                imageCounter++;
            } catch (err) {
                console.error(`Failed to downlod main image for ${product.id}`, err.message);
            }
        }

        // Process gallery images
        if (product.gallery && Array.isArray(product.gallery)) {
            for (let j = 0; j < product.gallery.length; j++) {
                const gImage = product.gallery[j];
                if (gImage && gImage.includes('cdn.shopify.com')) {
                    try {
                        const parsedUrl = new URL(gImage);
                        let filename = path.basename(parsedUrl.pathname);
                        filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');

                        const localPath = `/images/products/${filename}`;
                        const destPath = path.join(FRONTEND_PUBLIC_IMAGES, filename);

                        await downloadImage(gImage, destPath);
                        product.gallery[j] = localPath;
                        imageCounter++;
                    } catch (err) {
                        console.error(`Failed to downlod gallery image ${j} for ${product.id}`, err.message);
                    }
                }
            }
        }
    }

    console.log(`Downloaded ${imageCounter} images. Saving JSON files...`);

    // Write back to backend
    fs.writeFileSync(BACKEND_DB_PAGES, JSON.stringify(products, null, 2));
    // Write back to frontend
    fs.writeFileSync(FRONTEND_DB_PAGES, JSON.stringify(products, null, 2));

    console.log('Done!');
}

processProducts().catch(console.error);
