const fs = require('fs');
const path = require('path');

const dir = 'c:/Andrei/Documents/PROY GESTION AGIL/PROYECTO/frontend/src/pages';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        const bellRegex = /<div\s+className=["']notification["']>\s*<i\s+className=["']fas\s+fa-bell["']><\/i>\s*<\/div>/g;
        
        if (bellRegex.test(content)) {
            content = content.replace(bellRegex, '<NotificationBell />');
            
            if (!content.includes("import NotificationBell")) {
                const importMatch = [...content.matchAll(/^import.*?;?\s*$/gm)].pop();
                if (importMatch) {
                    const insertPos = importMatch.index + importMatch[0].length;
                    content = content.slice(0, insertPos) + "\nimport NotificationBell from '../components/NotificationBell';\n" + content.slice(insertPos);
                } else {
                    content = "import NotificationBell from '../components/NotificationBell';\n" + content;
                }
            }
            
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            console.log('Updated ' + file);
        }
    }
});
