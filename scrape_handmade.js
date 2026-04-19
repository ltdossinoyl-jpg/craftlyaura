const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://handmadebestseller.com/';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const titleMatch = data.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'Handmade Bestseller';

        console.log(`Title: ${title}`);

        // Try to extract some product links or images if it's a Shopify store, we might find products.json
        // Wait, Shopify stores often expose products.json for collections. Let's try that.
    });

}).on('error', (err) => {
    console.error(`Error: ${err.message}`);
});
