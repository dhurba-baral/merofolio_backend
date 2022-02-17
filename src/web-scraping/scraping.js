const puppeteer = require('puppeteer');
const express =require("express")
const app =express()

async function start(){
    try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto("https://merolagani.com/LatestMarket.aspx")
    let data = await page.$$eval('#ctl00_ContentPlaceHolder1_LiveTrading > table> tbody > tr',(rows)=>{
        let list = [];
        rows.forEach(row=>{
            let record = {"Symbol":"","Companyname":"","Ltp":""}
            record.Symbol= row.querySelector("td>a").textContent;
            fullname = row.querySelector("td>a").title;
            record.Companyname = fullname.substring( fullname.indexOf( '(' ) + 1, fullname.indexOf( ')' ) )
            record.Ltp = row.querySelector("td:nth-child(2)").textContent
            list.push(record)
        })
        return list;
    }
    )
    return data;
    // await browser.close();
    }
    catch(err){
        res.status(400).send(error);
    }
}

app.get("/api/livedata",async (req,res)=>{
    const data = await start()
    res.status(201).send(data);

})

app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});