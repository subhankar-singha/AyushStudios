const fs = require('fs');
const path = "c:\\Users\\subha\\Downloads\\AYUSHSTudios\\unlicensedVersion\\services.html";
let content = fs.readFileSync(path, 'utf8');

// The invalid javascript:
// let summary = "PROJECT SUMMARY
//
// ";
// We will simply replace the double quoted literal with backticks, which allows newlines.
// Or we can just use a regex.

content = content.replace('let summary = "PROJECT SUMMARY\\n\\n";', 'let summary = "PROJECT SUMMARY\\\\n\\\\n";');

// Also fix the other occurrences where we appended to summary
content = content.replace(/summary \+= `(.*?)\\n`/g, (match, p1) => {
    return 'summary += `' + p1 + '\\\\n`';
});

// Since the newlines got evaluated, they are actually actual newline characters in the file now
// Let's just fix it by string replacement over the raw string

const fixNewlines = [
    ['let summary = "PROJECT SUMMARY\\n\\n";', 'let summary = "PROJECT SUMMARY\\\\n\\\\n";'],
    ['summary += `Song ${i}\\nName: ${title}\\n`;', 'summary += `Song ${i}\\\\nName: ${title}\\\\n`;'],
    ['summary += `Category: Not Selected\\n\\n`;', 'summary += `Category: Not Selected\\\\n\\\\n`;'],
    ['summary += `Category: ${category}\\n`;', 'summary += `Category: ${category}\\\\n`;'],
    ['summary += `Services: Readymade Package - ${rPack ? rPack.value : \\'Standard\\'}\\n\\n`;', 'summary += `Services: Readymade Package - ${rPack ? rPack.value : \\'Standard\\'}\\\\n\\\\n`;'],
    ['summary += `Services:\\n`;', 'summary += `Services:\\\\n`;'],
    ['summary += `* ${c.value}\\n`;', 'summary += `* ${c.value}\\\\n`;'],
    ['summary += `* ${r.value}\\n`;', 'summary += `* ${r.value}\\\\n`;'],
    ['summary += `* None Selected\\n`;', 'summary += `* None Selected\\\\n`;'],
    ['summary += `\\n`;', 'summary += `\\\\n`;']
];

for (const [find, replace] of fixNewlines) {
    // The find string actually has actual newlines inside the file because `apply_ui_update.js` wrote them as literal \n.
    // wait, `apply_ui_update.js` wrote `\n` characters, so let's match literal newlines.
    const literalFind = find.replace(/\\\\n/g, '\n');
    content = content.replace(literalFind, replace);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Fix applied!");
