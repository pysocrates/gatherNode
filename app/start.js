// Grab all HTML entities and CSS related to it
// stored via JSON
// probably not the best way to do this xD

const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');
const results = [];

async function scrapeStyles(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        // Define 'styles' inside the try block and within the scope of the function
        const styles = await page.evaluate(() => {
            const elements = [...document.body.getElementsByTagName('*')];
            return elements.map(el => ({
                html: el.outerHTML,
                style: JSON.parse(JSON.stringify(getComputedStyle(el)))
            }));
        });

        await browser.close();
        return styles;  // Return 'styles' here
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return [];  // Return an empty array in case of error
    }
}


function saveStylesToFile(url, styles) {
    if (!styles || styles.length === 0) {
        console.log(`No styles to save for ${url}`);
        return;
    }

    const fileName = `styles-${url.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    fs.writeFile(fileName, JSON.stringify(styles, null, 2), err => {
        if (err) {
            console.error(`Error saving styles for ${url}:`, err);
            return;
        }
        console.log(`Styles for ${url} saved to ${fileName}`);
    });
}

async function processUrls(urls) {
    for (const url of urls) {
        if (!url || typeof url !== 'string' || url.trim() === '') {
            console.log(`Skipping invalid or empty URL: ${url}`);
            continue;
        }

        try {
            const styles = await scrapeStyles(url);
            saveStylesToFile(url, styles);
        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
        }
    }
}

function readCSVAndProcessUrls(filePath) {
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv({
            headers: false
        }))
        .on('data', (row) => {
            const url = row[0];
            if (url) {
                results.push(url);
            } else {
                console.log('Found row without URL:', row);
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            processUrls(results);
        });
}

readCSVAndProcessUrls('source/urls.csv');
