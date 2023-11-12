// get full CSS rules
// exports to CSS file
const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getStyles(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const styles = await page.evaluate(() => {
    const elementsSelector = 'header, header *, footer, footer *, div, div *';
    const elements = Array.from(document.querySelectorAll(elementsSelector));
    const matchedRules = new Set();

    Array.from(document.styleSheets).forEach(sheet => {
      if (sheet.cssRules) {
        Array.from(sheet.cssRules).forEach(rule => {
          try {
            if (elements.some(el => el.matches(rule.selectorText))) {
              matchedRules.add(rule.cssText);
            }
          } catch (e) {
            // Ignoring errors caused by pseudo-selectors
          }
        });
      }
    });

    return Array.from(matchedRules).join('\n');
  });

  await browser.close();
  return styles;
}

function askForURL() {
  rl.question('Enter a URL to extract CSS: ', (url) => {
    getStyles(url).then(css => {
      fs.writeFile('extractedSpecificRules.css', css, err => {
        if (err) {
          console.error('Error writing to file', err);
        } else {
          console.log(`Saved specific CSS rules of ${url} to extractedSpecificRules.css`);
          askForAnotherURL();
        }
      });
    });
  });
}

function askForAnotherURL() {
  rl.question('Do you want to extract from another URL? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
      askForURL();
    } else {
      rl.close();
    }
  });
}

// Start the process
askForURL();
