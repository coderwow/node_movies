// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
/* import {
    resolve
} from 'path'; */
const resolve = require('path').resolve;


const BASE_URL = `https://movie.douban.com/subject/`;


// 等待3000毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

process.on('message', async movies => {
    console.log('start visit the target page');
    const browser = await puppeteer.launch({
        headless: false,
        dumpio: false,
        executablePath: resolve(__dirname, '../chrome-mac/Chromium.app//Contents/MacOS/Chromium'),
        args: ['--no-shadbox']
    });
    const page = await browser.newPage();

    for(let i = 0; i < movies.length; i++) {
        let doubanId = movies[i].doubanId;
        await page.goto(BASE_URL + doubanId, {
            waitUntil: 'networkidle2'
        });
        await sleep(2000);
        const result = await page.evaluate(() => {
            const $ = window.$;
            let it = $('.related-pic-video');

            if (it && it.length > 0) {
                let link = it.attr('href');
                let cover = it.attr('style').split('url(')[1].split(')')[0];
                return {
                    link,
                    cover
                }
            }
            return {};
        })

        let video;
        if (result.link) {
            await page.goto(result.link, {
                waitUntil: 'networkidle2'
            });
            await sleep(2000);
            video = await page.evaluate(() => {
                const $ = window.$;
                let it = $('source')
                if (it && it.length > 0) {
                    let site = it.attr('src');
                    return site
                }

                return '';
            })
        }

        const data = {
            video,
            doubanId,
            cover:result.cover
        }

        console.log(data)

        process.send(data);
    }

    browser.close();
    process.exit(0);
})