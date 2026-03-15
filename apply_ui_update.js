const fs = require('fs');

const path = "c:\\Users\\subha\\Downloads\\AYUSHSTudios\\unlicensedVersion\\services.html";
let content = fs.readFileSync(path, 'utf8');

// 1. Replace the Music Packages HTML
const pGridStart = content.indexOf('<div class="packages-grid">');
const vProdStart = content.indexOf('<!-- 3. Video Production Section -->');
// Find the closing </section> just before video production
const sectionEnd = content.lastIndexOf('</section>', vProdStart);

const newBlock = `
        <div id="dynamic-music-system" class="custom-build" style="max-width: 1200px; margin: 3rem auto; background: transparent; border: none; padding: 0;">
            <div class="custom-build" style="margin-bottom: 2rem; border-color: var(--gray-mid); background: var(--bg-white);">
                <h3 style="margin-bottom: 1.5rem;">How many songs are you producing?</h3>
                <select id="num-songs-selector" class="q-input" style="max-width: 300px; margin: 0 auto; display: block; text-align: center; cursor: pointer;" onchange="generateSongConfigs()">
                    <option value="0">Select number of songs</option>
                    <option value="1">1 Song</option>
                    <option value="2">2 Songs</option>
                    <option value="3">3 Songs</option>
                    <option value="4">4 Songs</option>
                    <option value="5">5 Songs</option>
                    <option value="6">6 Songs</option>
                    <option value="10+">10+ Songs</option>
                </select>
            </div>
            
            <div id="songs-container"></div>

            <div id="generate-quote-container" style="display: none; text-align: center; margin-top: 3rem; margin-bottom: 3rem;">
                <button class="btn btn-primary" onclick="generateProjectSummary()" style="font-size: 1.2rem; padding: 1rem 3rem;"><i class="fa-solid fa-file-invoice"></i> Generate Quote</button>
            </div>
        </div>
`;

content = content.substring(0, pGridStart) + newBlock + content.substring(sectionEnd);

// 2. Replace the #qt-service input with a textarea
content = content.replace('<input type="text" id="qt-service" class="q-input" readonly>', '<textarea id="qt-service" class="q-input" readonly rows="8" style="resize: vertical;"></textarea>');

// 3. Inject the JS functionality at the end of the script block
const jsCode = `
        // ============================================
        // DYNAMIC MULTI-SONG CONFIGURATOR LOGIC
        // ============================================
        
        const categoryMap = {
            "Original Song": {
                sections: [
                    {
                        title: "Songwriting & Composition",
                        type: "checkbox",
                        options: ["Music Composition", "Lyrics Writing", "Complete Songwriting (Lyrics & Melody)"]
                    },
                    {
                        title: "Recording",
                        type: "checkbox",
                        options: ["Lead Vocal Recording", "Group Vocal Recording", "Instrument Recording"],
                        note: "Vocal Coaching (During Recording) and Song Direction & Creative Guidance are included with any recording service."
                    },
                    {
                        title: "Music Arrangement & Programming",
                        type: "radio",
                        options: ["Full Music Arrangement", "Semi Music Arrangement (Up to 4 instruments)", "Piano Based Arrangement"]
                    },
                    {
                        title: "Post Production",
                        type: "checkbox",
                        options: ["Vocal Pitch Correction", "Stereo Mixing & Mastering"],
                        note: "Vocal Editing (Comping, Timing & Cleanup) is included with Stereo Mixing & Mastering."
                    }
                ]
            },
            "Cover Song": {
                sections: [
                    {
                        title: "Recording",
                        type: "checkbox",
                        options: ["Lead Vocal Recording", "Group Vocal Recording", "Instrument Recording"],
                        note: "Vocal Coaching and Creative Guidance are included with recording services."
                    },
                    {
                        title: "Music Arrangement & Programming",
                        type: "radio",
                        options: ["Full Music Arrangement", "Semi Music Arrangement (Up to 4 instruments)", "Piano Based Arrangement"]
                    },
                    {
                        title: "Post Production",
                        type: "checkbox",
                        options: ["Vocal Pitch Correction", "Stereo Mixing & Mastering"]
                    }
                ]
            },
            "Advertisements, Commercials & Jingles": {
                sections: [
                    {
                        title: "Voice Recording / Music",
                        type: "checkbox",
                        options: ["Voice Recording", "Music Composition", "Sound Design", "Mixing & Mastering"]
                    }
                ]
            },
            "Poetry & Recitation": {
                sections: [
                    {
                        title: "Audio Services",
                        type: "checkbox",
                        options: ["Voice Recording", "Background Music", "Editing", "Mastering"]
                    }
                ]
            },
            "Audio Stories & Audiobooks": {
                sections: [
                    {
                        title: "Audio Services",
                        type: "checkbox",
                        options: ["Narration Recording", "Character Voice Recording", "Background Music", "Sound Effects", "Editing", "Mastering"]
                    }
                ]
            }
        };

        function generateSongConfigs() {
            const selector = document.getElementById('num-songs-selector');
            const container = document.getElementById('songs-container');
            const quoteBtnContainer = document.getElementById('generate-quote-container');
            
            let numSongsStr = selector.value;
            let numSongs = 0;
            if (numSongsStr === "10+") numSongs = 10;
            else numSongs = parseInt(numSongsStr) || 0;
            
            container.innerHTML = '';
            
            if (numSongs > 0) {
                quoteBtnContainer.style.display = 'block';
                for (let i = 1; i <= numSongs; i++) {
                    container.appendChild(createSongCard(i));
                }
            } else {
                quoteBtnContainer.style.display = 'none';
            }
        }

        function createSongCard(index) {
            const card = document.createElement('div');
            card.className = 'custom-build';
            card.style.marginBottom = '2rem';
            card.style.textAlign = 'left';
            card.style.padding = '3rem 2rem';
            card.style.position = 'relative';
            
            card.innerHTML = \`
                <h3 style="margin-bottom: 2rem; text-align: center; border-bottom: 1px solid var(--gray-mid); padding-bottom: 1rem;">Song \${index}</h3>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Song Title</label>
                    <input type="text" id="song-\${index}-title" class="q-input" placeholder="Enter song title">
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Category</label>
                    <select id="song-\${index}-category" class="q-input" onchange="renderPackageOptions(\${index})" style="cursor: pointer;">
                        <option value="">Select Category</option>
                        <option value="Original Song">Original Song</option>
                        <option value="Cover Song">Cover Song</option>
                        <option value="Advertisements, Commercials & Jingles">Advertisements, Commercials & Jingles</option>
                        <option value="Poetry & Recitation">Poetry & Recitation</option>
                        <option value="Audio Stories & Audiobooks">Audio Stories & Audiobooks</option>
                    </select>
                </div>
                
                <div id="song-\${index}-package-type-container" style="display: none; margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Package Type</label>
                    <div class="scope-options">
                        <label class="toggle-option">
                            <input type="radio" name="song-\${index}-package-type" value="Readymade Packages" onchange="renderPackageSpecifics(\${index})" checked>
                            <span>Readymade Packages</span>
                        </label>
                        <label class="toggle-option">
                            <input type="radio" name="song-\${index}-package-type" value="Custom Package" onchange="renderPackageSpecifics(\${index})">
                            <span>Custom Package</span>
                        </label>
                    </div>
                </div>
                
                <div id="song-\${index}-package-specifics"></div>
            \`;
            return card;
        }

        function renderPackageOptions(index) {
            const catSelect = document.getElementById(\`song-\${index}-category\`);
            const ptContainer = document.getElementById(\`song-\${index}-package-type-container\`);
            const val = catSelect.value;
            
            if (val) {
                ptContainer.style.display = 'block';
                const radios = document.getElementsByName(\`song-\${index}-package-type\`);
                radios[0].checked = true;
                renderPackageSpecifics(index);
            } else {
                ptContainer.style.display = 'none';
                document.getElementById(\`song-\${index}-package-specifics\`).innerHTML = '';
            }
        }

        function renderPackageSpecifics(index) {
            const pType = document.querySelector(\`input[name="song-\${index}-package-type"]:checked\`).value;
            const catSelect = document.getElementById(\`song-\${index}-category\`).value;
            const container = document.getElementById(\`song-\${index}-package-specifics\`);
            
            container.innerHTML = '';
            
            if (pType === "Readymade Packages") {
                container.innerHTML = \`
                    <div class="packages-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 0;">
                        <div class="premium-card" style="padding: 1.5rem; cursor: pointer; display: flex; flex-direction: column;" onclick="selectReadymade(this, \${index}, 'Basic')">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                <h4 style="margin: 0; font-size: 1.3rem;">Basic</h4>
                                <input type="radio" name="song-\${index}-readymade" value="Basic" style="transform: scale(1.3); pointer-events: none;">
                            </div>
                        </div>
                        <div class="premium-card popular" style="padding: 1.5rem; cursor: pointer; border-color: var(--primary); display: flex; flex-direction: column;" onclick="selectReadymade(this, \${index}, 'Standard')">
                            <div class="popular-badge" style="font-size: 0.6rem; padding: 0.2rem 0.6rem; top: -10px;">Popular</div>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                <h4 style="margin: 0; font-size: 1.3rem;">Standard</h4>
                                <input type="radio" name="song-\${index}-readymade" value="Standard" style="transform: scale(1.3); pointer-events: none;" checked>
                            </div>
                        </div>
                        <div class="premium-card" style="padding: 1.5rem; cursor: pointer; display: flex; flex-direction: column;" onclick="selectReadymade(this, \${index}, 'Premium')">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                <h4 style="margin: 0; font-size: 1.3rem;">Premium</h4>
                                <input type="radio" name="song-\${index}-readymade" value="Premium" style="transform: scale(1.3); pointer-events: none;">
                            </div>
                        </div>
                    </div>
                \`;
            } else {
                const catData = categoryMap[catSelect];
                if (!catData) return;
                
                let html = '<div style="background: var(--bg-white); border: 1px solid var(--gray-mid); padding: 2rem; border-radius: 4px;">';
                
                catData.sections.forEach((sec, sIdx) => {
                    html += \`<h4 style="margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1px solid var(--gray-light); padding-bottom: 0.5rem;">\${sec.title}</h4>\`;
                    html += \`<div class="scope-options" style="margin-bottom: 1rem; align-items: stretch; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">\`;
                    
                    sec.options.forEach((opt, oIdx) => {
                        const isRadio = sec.type === 'radio';
                        const name = isRadio ? \`song-\${index}-group-\${sIdx}\` : \`song-\${index}-custom[]\`;
                        html += \`
                            <label class="toggle-option" style="margin-bottom: 0; min-height: 50px;">
                                <input type="\${sec.type}" name="\${name}" value="\${opt}">
                                <span>\${opt}</span>
                            </label>
                        \`;
                    });
                    html += \`</div>\`;
                    
                    if (sec.note) {
                        html += \`<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2rem; font-style: italic;">* \${sec.note}</p>\`;
                    } else {
                        html += \`<div style="margin-bottom: 2rem;"></div>\`;
                    }
                });
                
                html += '</div>';
                container.innerHTML = html;
            }
        }

        function selectReadymade(card, index, val) {
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;
            
            const allCards = card.parentElement.querySelectorAll('.premium-card');
            allCards.forEach(c => {
                c.style.borderColor = 'var(--gray-mid)';
                c.classList.remove('popular');
            });
            
            card.style.borderColor = 'var(--primary)';
            card.classList.add('popular');
        }

        function generateProjectSummary() {
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

content = content.replace('</script>', jsCode + '\n    </script>');

fs.writeFileSync(path, content, 'utf8');
console.log("Success! Updated services.html.");
