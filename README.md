# gatherNode
A collection of node.js scrapers with unique behaviors

# Dependencies
- Puppeteer
- fs
- readline
- path
- csv

# App

## `start.js`
- Visits a URL and collects all HTML elements and related CSS styles, saved as JSON.

## `sanitize.js`
- Sanitizes collected JSON files from `start.js`. Put JSON files to be cleaned in the "san" folder.

## `capturePage.js`
- Visits URL, collects screenshot, collects CSS file, collects HTML, saves to folder.

## `cssonly.js`
- Collects CSS rules from destination page, saves as CSS file.

# Installation
- It's just Node.js.

# Future
- Will be adding more specialized scraping behaviors as time goes on.
