const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

puppeteer.use(
  RecaptchaPlugin({
    provider: { id: "2captcha", token: "6fef2c73a3fe89c12946df5a46508f22" },
  })
);
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://mtmis.excise.punjab.gov.pk/");
  await page.type('input[name="vhlno"]', "LXZ 123");
  await page.waitForSelector(".search button:not([disabled])");
  await page.click(".search button");
  await page.waitForSelector(".g-recaptcha iframe");
  const { solved, error } = await page.solveRecaptchas();
  if (solved) {
    console.log("✔️ The captcha has been solved");
  } else {
    console.log(error);
  }
  await page.waitForSelector(".search button:not([disabled])");
  await page.click(".search button");
  await page.waitForSelector(".sec2-lable");
  const data = await page.evaluate(() => {
    const labels = document.querySelectorAll(".sec2-lable");
    const values = document.querySelectorAll(".sec2-data");
    const result = {};
    labels.forEach((label, index) => {
      const key = label.textContent.trim();
      const value = values[index].textContent.trim();
      result[key] = value;
    });
    return result;
  });
  console.log(data);
  await browser.close();
})();
