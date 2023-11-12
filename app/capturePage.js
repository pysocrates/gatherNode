// this script will visit a page, 
// take a screen shot, gather the HTML and CSS, 
// and save it to a unique folder. 
//
// TODO - Read from JSON, CSV, etc
// 
const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function captureWebpage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Create a directory for the webpage
  const dirName = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  if (!fs.existsSync(dirName)){
    fs.mkdirSync(dirName);
  }

  // Take full page screenshot
  await page.screenshot({ path: `${dirName}/screenshot.png`, fullPage: true });

  // Extract HTML
  const html = await page.content();
  fs.writeFileSync(`${dirName}/page.html`, html);

  // Extract CSS
  const styles = await page.evaluate(() => {
    return Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          console.log(e);
          return '';
        }
      })
      .join('\n');
  });
  fs.writeFileSync(`${dirName}/styles.css`, styles);

  await browser.close();
}

function askForURL() {
  rl.question('Enter a URL to capture: ', (url) => {
    captureWebpage(url).then(() => {
      console.log(`Capture complete for ${url}`);
      askForAnotherURL();
    });
  });
}

function askForAnotherURL() {
  rl.question('Do you want to capture another URL? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
      askForURL();
    } else {
      rl.close();
    }
  });
}

// Start the process
askForURL();
