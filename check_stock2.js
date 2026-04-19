const fs = require('fs');
const d = require('./handmadebestseller_project/frontend/src/data/products.json');

let lines = [];
lines.push('Total products: ' + d.length);
lines.push('');
lines.push('--- First 15 products ---');
d.slice(0, 15).forEach(function (p, i) {
    lines.push('[' + i + '] ' + p.name.substring(0, 45) + ' | stock: ' + (p.stock !== undefined ? p.stock : 'N/A') + ' | price: ' + p.price);
});

lines.push('');
lines.push('--- Stock distribution ---');
var inStock = d.filter(function (p) { return p.stock === undefined || p.stock > 0; });
var outOfStock = d.filter(function (p) { return p.stock === 0; });
lines.push('In stock: ' + inStock.length);
lines.push('Out of stock: ' + outOfStock.length);

lines.push('');
lines.push('--- Out of stock in first 8 ---');
d.slice(0, 8).forEach(function (p, i) {
    if (p.stock === 0) {
        lines.push('[' + i + '] OOS: ' + p.name.substring(0, 50));
    }
});

lines.push('');
lines.push('--- In stock products (first 20) ---');
var inStockProds = d.filter(function (p) { return p.stock === undefined || p.stock > 0; });
inStockProds.slice(0, 20).forEach(function (p, i) {
    var idx = d.indexOf(p);
    lines.push('[orig:' + idx + '] ' + p.name.substring(0, 45) + ' | stock: ' + (p.stock !== undefined ? p.stock : 'N/A') + ' | price: ' + p.price);
});

fs.writeFileSync('stock_report.json', JSON.stringify(lines, null, 2), 'utf8');
