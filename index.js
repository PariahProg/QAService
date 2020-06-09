const express = require('express');
const port = 8080;
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

db.connect(err => {
    if(err)
        return console.error(err);

    const sectionController = require('./controllers/sectionController');
    const authController = require('./controllers/authController');
    const resetController = require('./controllers/resetController');
    const verifyController = require('./controllers/verifyController');
    const questionController = require('./controllers/questionController');
    const answerController = require('./controllers/answerController');

    const authMiddleware = require('./middleware/auth');
    const verifyUserMiddleware = require('./middleware/verifyUser');
    
    app.use(cors({origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:10582'], credentials: true}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    
    app.get('/sections', sectionController.getSections); // Вывод всех категорий
    app.get('/confirm/:verifyToken', verifyController.verify); // Верификация аккаунта пользователя
    app.get('/questions', questionController.getAllQuestions); // Вывод всех вопросов
    app.get('/question/:id', questionController.getQuestion); // Отдельный вопрос на странице
    app.get('/user/questions', authMiddleware, questionController.getQuestionsUser); // Вывод вопроса пользователя
    app.get('/:id', questionController.getQuestionsBySectionOrSubsection); // Вывод вопросов категории или подкатегории
    app.post('/ask', authMiddleware, verifyUserMiddleware, questionController.makeQuestion); // Задать вопрос
    app.post('/question/:id/delete', authMiddleware, verifyUserMiddleware, questionController.deleteQuestion); // Удалить вопрос
    app.get('/user/answers', authMiddleware, answerController.getAnswersUser); // Вывод ответов пользователя
    /*Это должно быть в самом низу гет запросов*/
    app.get('/search', questionController.search); // Поиск

    
    app.post('/user/signUp', authController.signUp); // Регистрация
    app.post('/user/signIn', authController.signIn); // Авторизация
    app.post('/user/refresh-tokens', authController.refreshTokens); // рефреш токена
    app.post('/user/resetPassword', authMiddleware, verifyUserMiddleware, resetController.resetPassword); // Новый пароль
    app.post('/user/resetEmail', authMiddleware, verifyUserMiddleware, resetController.resetEmail); // Новый мейл
    app.post('/logout', authMiddleware, authController.logout);
    app.post('/answer', authMiddleware, verifyUserMiddleware, answerController.makeAnswer); // Ответить на вопрос
    app.post('/answer/:id/delete', authMiddleware, verifyUserMiddleware, answerController.deleteAnswer); // Удалить ответ
    app.post('/setLikeAnswer/:id', authMiddleware, verifyUserMiddleware, answerController.setLikeAnswer); // лайк Ответу
    app.post('/setDislikeAnswer/:id', authMiddleware, verifyUserMiddleware, answerController.setDislikeAnswer); // дизлайк Ответу
    

    app.listen(port, () => console.log(`Server has been started on port ${port}!`)); 
})


