const fs = require('fs');

const inputFile = './handmadebestseller_project/frontend/src/data/handmade_products.json';
const outputFile = './handmadebestseller_project/frontend/src/data/products.json';

try {
    const shopifyData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    const products = shopifyData.products.map(p => {
        // Strip HTML from description
        const description = p.body_html ? p.body_html.replace(/<[^>]+>/g, '') : '';
        const images = (p.images || []).map(img => img.src);
        const mainImage = images.length > 0 ? images[0] : '';
        let price = 0;
        if (p.variants && p.variants.length > 0 && p.variants[0].price) {
            price = parseFloat(p.variants[0].price);
        }
        return {
            id: String(p.id),
            name: p.title,
            price: price,
            description: description,
            image: mainImage,
            images: images,
            handle: p.handle,
            slug: p.handle,
            category: p.product_type
        };
    });

    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2), 'utf-8');
    console.log('Successfully converted ' + products.length + ' products.');
} catch (error) {
    console.error('Error converting products:', error);
}
