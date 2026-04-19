const fs = require('fs');
const path = require('path');

const walkSync = function (dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

const files = walkSync(__dirname + '/frontend/src');

files.forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js')) {
        let content = fs.readFileSync(file, 'utf8');
        let needWrite = false;
        if (content.includes('handmadebestseller')) {
            content = content.replace(/handmadebestseller/gi, 'craftlyaura');
            needWrite = true;
        }
        if (content.includes('HandMadeBestSeller')) {
            content = content.replace(/HandMadeBestSeller/g, 'CraftlyAura');
            needWrite = true;
        }
        if (content.match(/handmade bestseller/i)) {
            content = content.replace(/handmade bestseller/gi, 'craftly aura');
            needWrite = true;
        }
        if (needWrite) {
            fs.writeFileSync(file, content, 'utf8');
            console.log("Updated: ", file);
        }
    }
});
