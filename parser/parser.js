const needle = require('needle');
const cheerio = require('cheerio');
const fs = require('fs');

let urlQuestions = 'https://stackoverflow.com/questions';

let dataQuestions = [];

let indexPage = 1;

function getQuestions(URL, indexPage) {
    needle.get(URL, (err, res) => {
        if (err) throw err;
        while (indexPage < 10) {
            let $ = cheerio.load(res.body);
    
            $('.summary').each((index, element) => {
                const title = $(element).find('.question-hyperlink').text().replace(/\n/g, '').trim();
                const question = $(element).find('.excerpt').text().replace(/\n/g, '').replace(/s\s+/, '').trim();
                const questionTime = $(element).find('.user-action-time').text().replace(/\n/g, '').trim();
                const username = $(element).find('.user-details > a').text();
                
                dataQuestions.push({
                    title: title,
                    question: question,
                    questionTime: questionTime,
                    username: username,
                    page: indexPage
                });
            })

            writeFileQuestions(fs);
            indexPage++;
            URL = `https://stackoverflow.com/questions?tab=newest&page=${indexPage}`;
    
            return getQuestions(URL, indexPage);
        }
    })
}

function writeFileQuestions(fs) {   
    return fs.writeFileSync('./data.json', JSON.stringify(dataQuestions, null, 4));
}

getQuestions(urlQuestions, indexPage);

