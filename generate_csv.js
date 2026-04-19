const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'frontend/src/data/products.json');
const outputPath = path.join(__dirname, 'all_products_export.csv');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const headers = [
    "Product Name (English)", "Product Status", "Product Token", "Product Type", "Description (English)",
    "Selling Method", "Case Size", "Minimum Order Quantity", "Item Weight", "Item Weight Unit",
    "Item Length", "Item Width", "Item Height", "Item Dimensions Unit", "Packaged Weight",
    "Packaged Weight Unit", "Packaged Length", "Packaged Width", "Packaged Height",
    "Packaged Dimensions Unit", "Option Status", "SKU", "GTIN", "Option 1 Name", "Option 1 Value",
    "Option 2 Name", "Option 2 Value", "Option 3 Name", "Option 3 Value", "USD Unit Wholesale Price",
    "USD Unit Retail Price", "CAD Unit Wholesale Price", "CAD Unit Retail Price",
    "GBR Unit Wholesale Price", "GBR Unit Retail Price", "EUR Unit Wholesale Price",
    "EUR Unit Retail Price", "AUD Unit Wholesale Price", "AUD Unit Retail Price", "Option Image",
    "Preorder", "Ship By Date (YYYY-MM-DD)", "Ship By End Date (if range, YYYY-MM-DD)",
    "Deadline To Order (YYYY-MM-DD)", "Sell After Order By/Ship Date", "Product Images",
    "Made In Country", "Tester Price (USD)", "Tester Price (CAD)", "Tester Price (GBP)",
    "Tester Price (EUR)", "Tester Price (AUD)", "Customizable", "Customization Instructions",
    "Customization Input Required", "Customization Input Character Limit", "Customization Minimum Order Quantity",
    "Customization Charge Per Unit (USD)", "Customization Charge Per Unit (CAD)",
    "Customization Charge Per Unit (GBP)", "Customization Charge Per Unit (EUR)",
    "Customization Charge Per Unit (AUD)", "Continue selling when out of stock", "On Hand Inventory",
    "On Hand Inventory (Read Only)", "Restock Date", "HS6 Tariff Code"
];

const csvRows = [headers.join('\t')];

function escapeCSV(val) {
    if (val === null || val === undefined) return '';
    let str = String(val);
    // Remove tabs from strings to prevent breaking the TSV structure
    str = str.replace(/\t/g, ' ');
    // Handle quotes for CSV-like behavior if opened in Excel
    if (str.includes('"')) {
        str = str.replace(/"/g, '""');
    }
    // For TSV, we don't necessarily need surrounding quotes unless there are tabs, 
    // but many importers handle quoted strings. 
    // However, for TSV, standard is usually raw text if no tabs exist.
    if (str.includes('\n') || str.includes('\r')) {
        return `"${str}"`;
    }
    return str;
}

products.forEach(p => {
    const row = [
        escapeCSV(p.name),
        "Published",
        escapeCSV(p.id),
        escapeCSV(p.category),
        escapeCSV(p.description),
        "By the item",
        "",
        "1",
        "",
        "kg",
        "",
        "",
        "",
        "cm",
        "",
        "kg",
        "",
        "",
        "",
        "cm",
        "Published",
        escapeCSV(p.slug),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        escapeCSV(p.price),
        escapeCSV(p.price),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "No",
        "",
        "",
        "",
        "",
        escapeCSV((p.images || []).map(img => `https://atlasurbancraft.com${img}`).join(', ')),
        "Morocco",
        "",
        "",
        "",
        "",
        "",
        "No",
        "",
        "No",
        "",
        "",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "Yes",
        "100",
        "100",
        "",
        ""
    ];
    csvRows.push(row.join('\t'));
});

fs.writeFileSync(outputPath, csvRows.join('\n'));
console.log(`Successfully exported ${products.length} products to ${outputPath}`);
