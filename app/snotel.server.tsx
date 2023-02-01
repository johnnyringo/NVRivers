const request = require('request');
const cheerio = require('cheerio');

export async function getSotel(){
    request('https://wcc.sc.egov.usda.gov/reports/UpdateReport.html?report=California/Nevada&format=SNOTEL+Precipitation+Summary+Update+Report', (error: any, response: { statusCode: number; }, html: any) => {
    if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        const data = $('strong').text();
        console.log(data);
    }
})};