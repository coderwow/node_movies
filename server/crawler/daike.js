// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
/* import {
    resolve
} from 'path'; */
const resolve = require('path').resolve;

const LINK_URL = `https://passport.lianjia.com/cas/login?service=https://link.lianjia.com/shiro-cas`;
const URL = `https://main.deyoulife.com`;

const account = '23112234';
const password = 'ke123456.';

/* const account = '23112234';
const password = 'sgzy1049765832@'; */

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
  page.setViewport({
    width: 1376,
    height: 768
  });
  /* const cookie = {
        lianjia_uuid: 'f643e426 - 77 f2 - 484 d - 82 ce - 8120e63 cc8ab',
        _lianjia_link_snid: '1000000023112234 % 3 Aadmin % 3 A % E7 % AE % A1 % E7 % 90 % 86 % E5 % 91 % 98 % 3 ASZBKJJ0001 % 3 A % E4 % BF % 8 A % E5 % AE % B6',
        HOUSEJSESSIONID: '1 f24ccb3 - 285 d - 446 f - aa55 - 690 da6522bbb'

    };
    await page.setCookie(cookie); */

  let val = {};

  await page.goto(LINK_URL, {
    waitUntil: 'networkidle2'
  });
  await page.click('[tabtarget=".ntNormal"]');
  await page.type('.ntNumber', account);
  await page.type('.ntPassword', password);
  await page.click('.actSubmit');
  await sleep(1000);

  await page.goto(URL, {
    waitUntil: 'networkidle2'
  });
  await page.mainFrame().addScriptTag({
    url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
  });

  await page.evaluate(() => {
    // document.querySelector('.msgList').style.display = 'block';
    const $ = window.$;
    // $('.msgList').css('display','block');
    $('.city1 li:nth-child(2) .son-child li:nth-child(2)').addClass('deyou');
  });
  await sleep(1000);
  await page.click('.deyou');
  // browser.close();
  // process.send({result});
  // process.exit(0);
})();
