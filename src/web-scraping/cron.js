const cron = require('node-cron');
const shell = require('shelljs');

cron.schedule("*/3 * * * *",function(){
    if(shell.exec("node scraping.js").code!==0){
        console.log("Something is wrong")
    }
})