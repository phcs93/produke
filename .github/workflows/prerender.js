const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const pages = ["home", "features", "nukemnet-support", "args-builder", "changelog"];

(async () => {

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  for (const route of pages) {

    const url = `http://localhost:8080/?p=${route}`;
    console.log(`${url}`);
    await page.goto(url, { waitUntil: "networkidle0" });
    const html = await page.content();

    const outputDir =
      route === "home"
        ? path.join(__dirname, "../public")
        : path.join(__dirname, "../public", route);

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), html);

    console.log(`✔ ${route}`);

  }

  await browser.close();
  
})();
