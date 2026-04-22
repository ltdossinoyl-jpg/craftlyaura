const fs = require('fs');
const path = './src/data/products.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

data.forEach(x => {
    let b = x.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    if (b.includes('Barrel')) {
        x.title = 'Authentic Moroccan Leather Barrel Bag - ' + b.replace(' Barrel Bag', '').replace(' Patterned', '');
    } else if (b.includes('Tote')) {
        x.title = 'Handcrafted Bohemian Leather Tote - ' + b.replace(' Tote', '');
    } else if (b.includes('Briefcase')) {
        x.title = 'Moroccan Artisan Leather Briefcase - ' + b.replace(' Briefcase', '');
    } else if (b.includes('Duffel')) {
        x.title = 'Eco-Friendly Genuine Leather Travel Duffel - ' + b.replace(' Duffel Bag', '').replace(' Duffel & Barrel Set', '');
    } else {
        x.title = 'Handmade Moroccan Leather Bag - ' + b;
    }

    x.title = x.title.replace(' -  ', ' - ').replace(/ - $/, '');

    let s = b.toLowerCase().includes('duffel') ? 'travel bag' : (b.toLowerCase().includes('tote') ? 'tote bag' : 'leather bag');

    x.description = "Greetings from the vibrant heart of the Moroccan Medina! As an artisan who has practiced traditional leatherworking for generations, I pour my soul into every single piece I create. This " + b.toLowerCase() + " is not just an accessory; it is a piece of true Moroccan artisanat.\n\nMeticulously handmade using 100% premium, eco-friendly genuine leather and natural dyes, this bohemian " + s + " carries the rich heritage and intricate craftsmanship of our culture. Every stitch is placed by hand with 'hub' (love) and immense attention to detail, ensuring it stands the test of time while aging beautifully.\n\nWhether you are looking to embrace a free-spirited bohemian aesthetic or appreciate sustainable, slow-fashion masterpieces, this bag is completely unique. Because it is genuinely handcrafted from natural materials, each piece carries its own distinct charm and texture—meaning nobody else in the world will own one exactly like yours.\n\n• 100% Authentic Handmade Moroccan Artisanat\n• Premium, Eco-Friendly Genuine Leather\n• Traditional Bohemian Design\n• Ethically crafted in our local workshop\n\nBring the warmth and authentic magic of Morocco into your everyday life with this timeless creation.";
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Descriptions and titles updated');
