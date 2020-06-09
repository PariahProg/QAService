const Question = require('../models/question');
const Answer = require('../models/answer');
const formatDate = require('../helper/dateFormatHelper').formatDate;

exports.getQuestion = async (req, res) => {
    if(!req.query.pageNumber) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});

    try {
        const question = await Question.getQuestion(req.params.id);
        const answers = await Answer.getAnswersToQuestion(req.params.id, req.query.pageNumber);
        const likedAnswers = await Answer.getLikedAnswers();
        const answersCount = await Answer.getAnswersCount(req.params.id);
        question.date = formatDate(question.date);
        return res.status(200).json({status: true, question, answers, answersCount, likedAnswers});
    }
    catch(err){
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.getAllQuestions = async (req, res) => {
    if(!req.query.pageNumber) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});

    try {
        const questions = await Question.getAllQuestions(req.query.pageNumber);
        const questionsCount = await Question.getQuestionsCount();
        for(question of questions){
            question.date = formatDate(question.date);
        }
        return res.status(200).json({status: true, questions, questionsCount});
    } catch (err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.getQuestionsBySectionOrSubsection = async (req, res) => {
    if(!req.query.pageNumber) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});

    try {
        const urlSection = await Question.getUrlSection(req.params.id);
        const urlSubsection = await Question.getUrlSubsection(req.params.id);

        for (let obj in urlSection){
            if (urlSection[obj].url === req.params.id) {
                const questionsCount = await Question.getQuestionSectionCount(urlSection[obj].name);   
                const questions = await Question.getQuestionsSection(urlSection[obj].name, req.query.pageNumber);
                for(question of questions){
                    question.date = formatDate(question.date);
                }
                return res.status(200).json({status: true, questions, questionsCount});
            }    
        }
        
        for (let obj in urlSubsection) {
            if (urlSubsection[obj].url === req.params.id) {
                const questionsCount = await Question.getQuestionSubsectionCount(urlSubsection[obj].name);
                const questions = await Question.getQuestionsSubsection(urlSubsection[obj].name, req.query.pageNumber);
                for(question of questions){
                    question.date = formatDate(question.date);
                }
                return res.status(200).json({status: true, questions, questionsCount});
            }
        }
        return res.status(400).json({status: false, message: 'Invalid URL parameter!'});
    }
    catch(err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.getQuestionsUser = async (req, res) => {
    if(!req.query.pageNumber) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});

    try {
        const questions = await Question.getQuestionsUser(res.locals.payload.userId, req.query.pageNumber);
        const questionsCount = await Question.getUserQuestionsCount(res.locals.payload.userId);
        for(question of questions){
            question.date = formatDate(question.date);
        }
        return res.status(200).json({status: true, questions, questionsCount});
    }
    catch(err){
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.makeQuestion = async (req, res) => {
    if(!req.body) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});
    
    let {topic, text, url} = req.body;

    if(!topic || !url || text==undefined)
        return res.status(400).json({status: false, message: 'Not enough parameters provided!'});

    try {
        const urlSection = await Question.getUrlSection(url);
        const urlSubsection = await Question.getUrlSubsection(url);

        for (let obj in urlSection) {
            if(urlSection[obj].url === url) {
                await Question.makeQuestion(topic, text, urlSection[obj].name, res.locals.payload.userId);
                return res.status(200).json({status: true});
            }
        }
        for (let obj in urlSubsection) {
            if(urlSubsection[obj].url === url) {
                await Question.makeQuestion(topic, text, urlSubsection[obj].name, res.locals.payload.userId);
                return res.status(200).json({status: true});
            }
        }
        return res.status(400).json({status: false, message: 'Invalid URL parameter!'});
    } catch(err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const questionUserId = await Question.getQuestionUserId(req.params.id);
        if(questionUserId === res.locals.payload.userId) {
            await Question.deleteQuestion(req.params.id);
            return res.status(200).json({status: true});
        }
        else {
            return res.status(403).json({status: false});
        }
    }
    catch(err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.search = async (req, res) => {
    if(!req.query.pageNumber || !req.query.text) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});

    try {
        const questionsCount = await Question.getFoundQuestionsCount(req.query.text);
        const foundQuestions = await Question.search(req.query.text, req.query.pageNumber);
        for(question of foundQuestions){
            question.date = formatDate(question.date);
        }
        return res.status(200).json({status: true, foundQuestions, questionsCount});
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}
