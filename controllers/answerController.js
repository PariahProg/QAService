const bodyParser = require('body-parser');
const Answer = require('../models/answer');
const Question = require('../models/question');
const formatDate = require('../helper/dateFormatHelper').formatDate;

exports.makeAnswer = async (req, res) => {
    if(!req.body) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});
    
    let {text, question} = req.body;
    if(!text || !question)
        return res.status(400).json({status: false, message: 'Not enough parameters provided!'});
    try{
        await Answer.makeAnswer(text, question, res.locals.payload.userId);
        return res.status(201).json({status: true});
    } catch (err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.deleteAnswer = async (req, res) => {
    try {
        const answerUserId = await Answer.getAnswerUserId(req.params.id);
        if(answerUserId === res.locals.payload.userId){
            await Answer.deleteAnswer(req.params.id);
            return res.status(200).json({status: true});
        }
        else {
            return res.status(403).json({status: false});
        }
    } catch (err) {
        return res.status(500).json({status: true, message: 'Internal server error!'});
    }
}

exports.getAnswersUser = async (req, res) => {
    if(!req.query.pageNumber) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});
    
    try {
        const questionsCount = await Question.getQuestionsToUserAnswersCount(res.locals.payload.userId);
        const question = await Question.getQuestionsToUserAnswers(res.locals.payload.userId, req.query.pageNumber);
        question.date = formatDate(question.date);
        const answers = await Answer.getAnswersUser(res.locals.payload.userId);
        return res.status(200).json({status: true, answers, question, questionsCount});
    } catch (err) {
        console.log(err);
        return res.status(400).json({status: false});
    }
}

exports.setLikeAnswer = async (req, res) => {
    try {
        await Answer.setLikeAnswer(req.params.id);
        await Answer.addUserLike(res.locals.payload.userId, req.params.id);
        const likedAnswers = await Answer.getLikedAnswers();
        const answers = await Answer.getAnswersToQuestion(req.query.question_id, req.query.pageNumber);
        return res.status(200).json({status: true, likedAnswers, answers});
    } catch (err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.setDislikeAnswer = async (req, res) => {
    try {
        await Answer.setDislikeAnswer(req.params.id);
        await Answer.removeUserLike(res.locals.payload.userId, req.params.id);
        const likedAnswers = await Answer.getLikedAnswers();
        const answers = await Answer.getAnswersToQuestion(req.query.question_id, req.query.pageNumber);
        return res.status(200).json({status: true, likedAnswers, answers});
    } catch (err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}


