const fs = require('fs');
const file = "c:\\Users\\subha\\Downloads\\AYUSHSTudios\\unlicensedVersion\\services.html";
let content = fs.readFileSync(file, "utf8");

const start = content.indexOf('function generateProjectSummary() {');
const end = content.indexOf('</script>', start);

const correctFunction = `function generateProjectSummary() {
            let summary = "PROJECT SUMMARY\\n\\n";
            let numSongsStr = document.getElementById('num-songs-selector').value;
            let numSongs = numSongsStr === "10+" ? 10 : parseInt(numSongsStr) || 0;
            
            if (numSongs === 0) return;
            
            for (let i = 1; i <= numSongs; i++) {
                const titleInput = document.getElementById(\`song-\${i}-title\`);
                const catInput = document.getElementById(\`song-\${i}-category\`);
                
                if (!titleInput || !catInput) continue;
                
                const title = titleInput.value.trim() || \`Untitled Song \${i}\`;
                const category = catInput.value;
                
                summary += \`Song \${i}\\nName: \${title}\\n\`;
                
                if (!category) {
                    summary += \`Category: Not Selected\\n\\n\`;
                    continue;
                }
                
                summary += \`Category: \${category}\\n\`;
                
                const pTypeInput = document.querySelector(\`input[name="song-\${i}-package-type"]:checked\`);
                const pType = pTypeInput ? pTypeInput.value : '';
                
                if (pType === "Readymade Packages") {
                    const rPack = document.querySelector(\`input[name="song-\${i}-readymade"]:checked\`);
                    summary += \`Services: Readymade Package - \${rPack ? rPack.value : 'Standard'}\\n\\n\`;
                } else if (pType === "Custom Package") {
                    summary += \`Services:\\n\`;
                    
                    const chks = document.querySelectorAll(\`input[name="song-\${i}-custom[]"]:checked\`);
                    chks.forEach(c => {
                        summary += \`* \${c.value}\\n\`;
                    });
                    
                    const customContainer = document.getElementById(\`song-\${i}-package-specifics\`);
                    const rads = customContainer.querySelectorAll('input[type="radio"]:checked');
                    rads.forEach(r => {
                        summary += \`* \${r.value}\\n\`;
                    });
                    
                    if (chks.length === 0 && rads.length === 0) {
                        summary += \`* None Selected\\n\`;
                    }
                    summary += \`\\n\`;
                }
            }
            
            document.getElementById('qt-service').value = summary.trim();
            openQuoteModal(summary.trim(), false);
        }
`;

content = content.substring(0, start) + correctFunction + content.substring(end);

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed the script block.");
