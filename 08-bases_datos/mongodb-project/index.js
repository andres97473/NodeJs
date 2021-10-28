const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const axios = require('axios').default;
const cheerio = require('cheerio');
const cron = require('node-cron');
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
const { BreakingNew } = require('./models');

// al minuto 0 cada cuatro horas
// 0 */4 * * *

// al minuto 24 cada hora
// 24 * * * *
cron.schedule("24 * * * *", async() => {
    console.log('Cron Job Executed!');
    const html = await axios.get("https://cnnespanol.cnn.com/");
    const $ = cheerio.load(html.data);
    const titles = $(".news__title");
    //console.log(titles);
    titles.each((index, element) => {
        const breakingNew = {
            title: $(element).text().trim(),
            link: $(element).children().attr("href")
        };
        // console.log(breakingNew);
        BreakingNew.create([breakingNew]);
    });
});