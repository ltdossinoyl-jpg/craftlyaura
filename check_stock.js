const d = require('./handmadebestseller_project/frontend/src/data/products.json');
console.log('Total products:', d.length);
console.log('\n--- First 15 products (current featured order) ---');
d.slice(0, 15).forEach(function (p, i) {
    console.log('[' + i + '] ' + p.name.substring(0, 50) + ' | stock: ' + (p.stock !== undefined ? p.stock : 'N/A') + ' | price: ' + p.price);
});

console.log('\n--- Stock distribution ---');
var inStock = d.filter(function (p) { return p.stock === undefined || p.stock > 0; });
var outOfStock = d.filter(function (p) { return p.stock === 0; });
console.log('In stock:', inStock.length);
console.log('Out of stock:', outOfStock.length);

console.log('\n--- Out of stock products in first 8 ---');
d.slice(0, 8).forEach(function (p, i) {
    if (p.stock === 0) {
        console.log('[' + i + '] OUT OF STOCK: ' + p.name.substring(0, 50));
    }
});
