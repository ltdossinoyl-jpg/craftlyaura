const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'handmadebestseller_project');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next')) {
                results = results.concat(walk(fullPath));
            }
        } else {
            if (/\.(ts|tsx|js|jsx|json|css|md|html)$/.test(file)) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(projectDir);

const replacements = [
    { from: /Atlas Urban Craft/gi, to: 'Handmade Bestseller' },
    { from: /atlasurbancraft/gi, to: 'handmadebestseller' },
    { from: /atlas urbancraft/gi, to: 'handmade bestseller' },
    { from: /atlas urban craft/gi, to: 'handmade bestseller' },
];

let replacedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    replacements.forEach(({ from, to }) => {
        content = content.replace(from, (match) => {
            // preserve casing if possible:
            if (match === match.toUpperCase()) return to.toUpperCase();
            if (match === match.toLowerCase()) return to.toLowerCase();
            return to;
        });
    });
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        replacedFiles++;
    }
});

console.log(`Total files updated: ${replacedFiles}`);
