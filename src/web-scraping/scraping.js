const puppeteer = require('puppeteer');
const express = require("express")
const app = express()
require('./cron.js')

async function start() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto("https://merolagani.com/LatestMarket.aspx")
        let data = await page.$$eval('#ctl00_ContentPlaceHolder1_LiveTrading > table> tbody > tr', (rows) => {
            let list = [];
            rows.forEach(row => {
                let record = { "Symbol": "", "Companyname": "", "Ltp": "", "Close": "" }
                record.Symbol = row.querySelector("td>a").textContent;
                fullname = row.querySelector("td>a").title;
                record.Companyname = fullname.substring(fullname.indexOf('(') + 1, fullname.indexOf(')'))
                record.Ltp = row.querySelector("td:nth-child(2)").textContent
                record.Close = row.querySelector("td:nth-child(8)").textContent
                list.push(record)
            })
            return list;
        }
        )
        return data;
        // await browser.close();
    }
    catch (error) {
        console.log(error);
    }
}

app.get("/api/livedata", async (req, res) => {
    try {
        const data = await start()
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send();
    }
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});