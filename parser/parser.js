const needle = require('needle');
const cheerio = require('cheerio');
const fs = require('fs');

let urlQuestions = 'https://stackoverflow.com/questions';
let urlCompanies = 'https://stackoverflow.com/jobs/companies';

let dataQuestions = [];
let dataCompanies = [];

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

function getCompanies(URL, indexPage) {
    needle.get(URL, (err, res) => {
        if (err) throw err;
        while (indexPage < 10) {
            let $ = cheerio.load(res.body);
    
            $('.dismissable-company.-company.ps-relative.js-dismiss-overlay-container.p24.bb.bc-black-3').each((index, element) => {
                const company = $(element).find('.fs-body2.mb4 > a').text().replace(/\n/g, '').replace(/s\s+/, '').trim();
                const location = $(element).find('.grid--cell.fc-black-500.fs-body1').text().trim();
                const companyDescription = $(element).find('.mt8.mb0.fs-body1.fc-black-700').text().replace(/\n/g, '').replace(/s\s+/, '').trim();

                dataCompanies.push({
                    company: company,
                    information: location,
                    companyDescription: companyDescription,
                    page: indexPage
                });
            })

            writeFileCompanies(fs);
            indexPage++;
            URL = `https://stackoverflow.com/jobs/companies?pg=${indexPage}`;
    
            return getCompanies(URL, indexPage);
        }
    })
}


function writeFileCompanies(fs) {
    return fs.appendFileSync('./data.json', JSON.stringify(dataCompanies, null, 4));
}

function writeFileQuestions(fs) {   
    return fs.writeFileSync('./data.json', JSON.stringify(dataQuestions, null, 4));
}

getQuestions(urlQuestions, indexPage);

getCompanies(urlCompanies, indexPage);