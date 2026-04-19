const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const FRONTEND_PUBLIC_IMAGES = path.join(__dirname, '../frontend/public/images/collections');

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

const imagesToDl = [
    "https://handmadebestseller.com/cdn/shop/collections/879585084f4a18b79ff55419da7d5685df8b717cdb0419c7565f01314cf5122b_360x.webp?v=1772673986",
    "https://handmadebestseller.com/cdn/shop/collections/73b36d82f37b90d8c7d5afeefc54c3d36079d53be186fc1aaae0ca7f270edbe2_540x.webp?v=1772756872",
    "https://handmadebestseller.com/cdn/shop/collections/d69c3bc1b50bafaf4e39bc274b47692785adf3526d588b5877060421f0b1fc2a_540x.webp?v=1772674137",
    "https://handmadebestseller.com/cdn/shop/collections/87994f47a8dcef948e5ba86e86ec56828049bb66286a204d335272f15ed1597a_360x.webp?v=1772756252",
    "https://handmadebestseller.com/cdn/shop/collections/69939dcd6f4419b437ce9ad5d1c98a812a9ffbfa450de9a0f96bd5673974121a_a4bb32bc-06e7-47bc-ab1e-6ad2a5877df9_360x.webp?v=1772929460",
    "https://handmadebestseller.com/cdn/shop/collections/6b77177976711dff8beba035c81e5ff55ba2e3b03be145bb997ff445a2882527_360x.webp?v=1772757452",
    "https://handmadebestseller.com/cdn/shop/collections/51ab86450d0dd1de09edecad88901f6fc2289652e3997908efce0f56f439efc7_360x.webp?v=1772674183",
    "https://handmadebestseller.com/cdn/shop/collections/59ef5776457df01b6839bc19d2b4e10bf81847e656597396cbff051d7faf0d02_540x.webp?v=1772673191",
    "https://handmadebestseller.com/cdn/shop/files/WhatsApp_Image_2026-03-04_at_4.35.54_PM.jpg?v=1773002775",
    "https://handmadebestseller.com/cdn/shop/files/457a26993f776af9db8a2a2f083770e9f5f63aa6bc75a8f5423d614cfa76f37f.jpg?v=1772928916",
    "https://handmadebestseller.com/cdn/shop/files/85e5f139d8cd064303760ea154676dcdd1494d2929d04815bd030b8ed5c576e1_1600x.webp?v=1772756965"
];

async function processProducts() {

    let imageCounter = 0;

    for (let i = 0; i < imagesToDl.length; i++) {
        const product = imagesToDl[i];
        try {
            const parsedUrl = new URL(product);
            let filename = path.basename(parsedUrl.pathname);
            filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const destPath = path.join(FRONTEND_PUBLIC_IMAGES, filename);
            console.log(`Downloading (${i + 1}): ${filename}`);
            await downloadImage(product, destPath);
            imageCounter++;
        } catch (err) {
            console.error(`Failed to downlod image`, err.message);
        }
    }

    console.log(`Downloaded ${imageCounter} images.`);
}

processProducts().catch(console.error);
