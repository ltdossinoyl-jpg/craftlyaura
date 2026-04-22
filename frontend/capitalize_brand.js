const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx') || dirPath.endsWith('.css') || dirPath.endsWith('.json')) {
                callback(dirPath);
            }
        }
    });
}

const targetDir = path.join(__dirname, 'src');

walkDir(targetDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace Craftly Aura variations with CRAFTLY AURA
    // But protect emails, domains, and folder paths
    const protectedPrefixes = ['@', '/', '.'];
    const protectedSuffixes = ['.com', '/', '_'];

    let newContent = content.replace(/(?<![@\/.])craftly\s?aura(?![.com|\/|_|a-z])/gi, 'CRAFTLY AURA');

    // Specific replacements for titles or plain text where it might be adjacent to a punctuation not in the negative lookahead
    // Let's refine the regex:
    // We want to replace "craftlyaura" and "craftly aura"
    // Negative lookbehind for: @ / .
    // Negative lookahead for: .com / _ 

    newContent = content.replace(/(?<![@\/\.-])\bcraftly\s?aura\b(?!\.com|\/|_[a-z])/gi, 'CRAFTLY AURA');

    // Handle specific edge cases missed by word boundaries, e.g. 'craftlyaura' inside a string like 'craftlyaura'
    newContent = newContent.replace(/'craftlyaura'/gi, "'CRAFTLY AURA'");
    newContent = newContent.replace(/"craftlyaura"/gi, '"CRAFTLY AURA"');
    newContent = newContent.replace(/'craftly aura'/gi, "'CRAFTLY AURA'");
    newContent = newContent.replace(/"craftly aura"/gi, '"CRAFTLY AURA"');

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
});
