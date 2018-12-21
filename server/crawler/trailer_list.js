// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
/* import {
    resolve
} from 'path'; */
const resolve = require('path').resolve;

const URL = `https://movie.douban.com/tag/#/?sort=R&range=7,10&tags=%E7%94%B5%E5%BD%B1`;

// 等待3000毫秒
const sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
(async () => {
  console.log('start visit the target page');
  const browser = await puppeteer.launch({
    headless: false,
    dumpio: false,
    executablePath: resolve(
      __dirname,
      '../chrome-mac/Chromium.app//Contents/MacOS/Chromium'
    ),
    args: ['--no-shadbox']
  });
  const page = await browser.newPage();
  await page.goto(URL, {
    waitUntil: 'networkidle2'
  });
  await sleep(2000);
  await page.waitForSelector('.more');
  for (let i = 0; i < 5; i++) {
    await sleep(2000);
    await page.click('.more');
  }
  const result = await page.evaluate(() => {
    let $ = window.$;
    let items = $('.list-wp a');
    let links = [];

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item);
        let doubanId = it.find('div').data('id');
        let title = it.find('.title').text();
        let rate = Number(it.find('.rate').text());
        let poster = it
          .find('img')
          .attr('src')
          .replace('s_ratio', 'l_ratio');

        links.push({
          doubanId,
          title,
          rate,
          poster
        });
      });
    }

    return links;
  });
  //   browser.close();
  process.send({ result });
  //   process.exit(0);
})();
