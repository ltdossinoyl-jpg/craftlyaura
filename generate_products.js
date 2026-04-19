const fs = require('fs');
const path = require('path');

const baseImagesDir = path.join(__dirname, 'images');
const frontendDataPath = path.join(__dirname, 'frontend', 'src', 'data', 'products.json');
const backendDataPath = path.join(__dirname, 'backend', 'products.json');

const productDetails = {
    1: { title: "Ocean Breeze Patterned Barrel Bag", feature: "vibrant blue woven patterns" },
    2: { title: "Crimson Sunset Patterned Barrel Bag", feature: "rich red and warm woven patterns" },
    3: { title: "Olive Grove Patterned Barrel Bag", feature: "earthy olive green woven patterns" },
    4: { title: "Desert Nomad Duffel & Barrel Set", feature: "a stunning matching set with intricate earthy patterns" },
    5: { title: "Mosaic Dream Multi-Color Barrel Bag", feature: "a beautiful mosaic of multi-colored woven patterns" },
    6: { title: "Sandstone Light Patterned Barrel Bag", feature: "subtle light beige woven designs" },
    7: { title: "Sapphire Elegance Leather Barrel Bag", feature: "smooth sapphire blue leather" },
    8: { title: "Rose Petal Pink Leather Barrel Bag", feature: "soft pink genuine leather" },
    9: { title: "Ruby Red Leather Barrel Bag", feature: "striking ruby red genuine leather" },
    10: { title: "Plum Royale Leather Barrel Bag", feature: "deep plum purple genuine leather" },
    11: { title: "Forest Green Leather Barrel Bag", feature: "rich forest green genuine leather" },
    12: { title: "Rustic Charm Cowhide Barrel Bag", feature: "unique natural black and white cowhide" },
    13: { title: "Tribal Fire Multi-Color Barrel Bag", feature: "bold red, grey, and yellow tribal patterns" },
    14: { title: "Golden Radiance Patterned Barrel Bag", feature: "bright yellow leather accents with elegant woven patterns" },
    15: { title: "Classic Tan Leather Barrel Bag", feature: "timeless tan brown genuine leather" },
    16: { title: "Emerald Envy Leather Barrel Bag", feature: "vibrant emerald green genuine leather" },
    17: { title: "Azure Blue Leather Tote", feature: "a spacious design in premium azure blue leather" },
    18: { title: "Cognac Dream Leather Shoulder Bag", feature: "warm cognac orange genuine leather" },
    19: { title: "Midnight Navy Classic Handbag", feature: "sophisticated midnight navy leather with premium gold-tone hardware" },
    20: { title: "Sunset Horizon Duffel & Barrel Set", feature: "a magnificent orange patterned matching bag set" },
    21: { title: "Burgundy Executive Briefcase", feature: "luxurious burgundy leather for the modern professional" },
    22: { title: "Onyx Black Duffel & Barrel Set", feature: "sleek all-black premium leather perfect for travel" },
    23: { title: "Maroon Classic Leather Briefcase", feature: "elegant maroon leather with refined details" },
    24: { title: "Wild West Cowhide Duffel Bag", feature: "a spacious travel bag featuring stunning natural cowhide" }
};

const variationTypes = {
    "Size": ["Small", "Medium", "Large"]
};

const variations = [
    { "Size": "Small", price: 45 },
    { "Size": "Medium", price: 65 },
    { "Size": "Large", price: 95 }
];

const products = [];

for (let i = 1; i <= 24; i++) {
    const folderPath = path.join(baseImagesDir, i.toString());
    let imageFiles = [];
    try {
        if (fs.existsSync(folderPath)) {
            imageFiles = fs.readdirSync(folderPath).filter(file => file.match(/\.(jpg|jpeg|png)$/i));
        }
    } catch (err) {
        console.error(`Error reading ${folderPath}:`, err);
    }

    // Ensure "0.jpg" or similar is first
    imageFiles.sort((a, b) => {
        if (a.startsWith('0.')) return -1;
        if (b.startsWith('0.')) return 1;
        return a.localeCompare(b);
    });

    const productImages = imageFiles.map(file => `/images/${i}/${file}`);

    const details = productDetails[i] || { title: `Handmade Leather Bag ${i}`, feature: `premium quality craftsmanship` };

    const description = `Discover the ${details.title}. Featuring ${details.feature}, this piece is truly one-of-a-kind. Crafted with 100% natural, high-quality leather, everything about this product is completely natural. It is 100% original—if you buy this, you won't find it anywhere else. Hand-made with 'hub' (love) and meticulous attention to detail, this bag is the perfect blend of durability and exquisite artistry.`;

    products.push({
        id: i.toString(),
        title: details.title,
        description: description,
        price: 65, // base price (medium)
        category: "Leather Bag",
        slug: details.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        image: productImages[0] || '/placeholder.jpg',
        images: productImages,
        variationTypes: variationTypes,
        variations: variations
    });
}

const jsonOutput = JSON.stringify(products, null, 2);

fs.writeFileSync(frontendDataPath, jsonOutput);
fs.writeFileSync(backendDataPath, jsonOutput);

console.log('Products JSON generated successfully.');
