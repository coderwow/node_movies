// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
/* import {
    resolve
} from 'path'; */
const resolve = require('path').resolve;


const URL = `https://su.lianjia.com/zufang/`;

const nextLink = `.page-box a:last-child`;
// const nextLink = `a.navigation-next`;
const data = [];
const HOUSE_ITEM = `.info-panel > h2`;
const LIST_ITEM = `li[data-el="zufang"]`;


// 等待3000毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

;
(async () => {
    console.log('start visit the target page');
    const browser = await puppeteer.launch({
        headless: false,
        dumpio: false,
        executablePath: resolve(__dirname, '../chrome-mac/Chromium.app//Contents/MacOS/Chromium'),
        args: ['--no-shadbox']
    });
    const page = await browser.newPage();
    /* const cookie = {
        lianjia_uuid: 'f643e426 - 77 f2 - 484 d - 82 ce - 8120e63 cc8ab',
        _lianjia_link_snid: '1000000023112234 % 3 Aadmin % 3 A % E7 % AE % A1 % E7 % 90 % 86 % E5 % 91 % 98 % 3 ASZBKJJ0001 % 3 A % E4 % BF % 8 A % E5 % AE % B6',
        HOUSEJSESSIONID: '1 f24ccb3 - 285 d - 446 f - aa55 - 690 da6522bbb'

    };
    await page.setCookie(cookie); */

    let val = {};

    try {
        await page.goto(URL, {
            waitUntil: 'networkidle2'
        });
        await page
            .mainFrame()
            .addScriptTag({
                url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
            })


        await sleep(3000);


        val = await page.evaluate((nextLink) => {
            return $(nextLink); //主要是审查页面元素  防止进入深渊进入死循环
        }, nextLink);


        while (val !== null && !!val) {
            await page.evaluate((LIST_ITEM, HOUSE_ITEM) => {
                function searchElement(parent = null) {
                    function getDataWithNull(element, attr, defaultValue) {
                        if ((element !== null) && (element instanceof HTMLElement)) {
                            return element[attr];
                        } else {
                            return defaultValue;
                        }
                    }
                    if (parent === null) {
                        parent = document;
                    }
                    return {
                        title: getDataWithNull(parent.querySelector(HOUSE_ITEM), 'innerText', '')
                    }
                }
                return Array.from(document.querySelectorAll(LIST_ITEM)).map((val) => {
                    return searchElement(val)
                })
            }, LIST_ITEM, HOUSE_ITEM).then((v) => {
                data.push(v);
                return v;
            })

            await page.click(nextLink)

            await page.waitForNavigation({
                timeout: 1000
            }).then(() => {}, async (a) => {
                val = await page.evaluate((nextLink) => {
                    return $(nextLink);
                }, nextLink);
            })

            await page.screenshot({
                path: 'companys.png', // 拍个照证明我们确实是因为调入深渊了
                fullPage: true
            })
        }

    } catch (e) {
        // 速度太快会进入深渊。这里只是演示所以直接点。
        console.log(`共爬取  ${data.length*10}`)
    } finally {
        console.log(data)
        // await browser.close();
    }
    // browser.close();
    // process.send({result});
    // process.exit(0);
})()