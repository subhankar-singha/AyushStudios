const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        await page.goto('file:///c:/Users/subha/Downloads/AYUSHSTudios/unlicensedVersion/work.html', { waitUntil: 'networkidle0' });

        const gridHtml = await page.$eval('#work-grid', el => el.outerHTML);
        console.log("--- GRID HTML ---");
        console.log(gridHtml.substring(0, 1000)); // print first 1000 chars

        const items = await page.$$eval('.project-item', els => els.map(e => ({ class: e.className, display: getComputedStyle(e).display, opacity: getComputedStyle(e).opacity })));
        console.log("--- ITEMS ---");
        console.log(items);

        await browser.close();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
