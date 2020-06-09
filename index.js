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

    const authMiddleware = require('./middleware/auth');
    const verifyUserMiddleware = require('./middleware/verifyUser');
    
    app.use(cors({origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:10582'], credentials: true}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    
    app.get('/sections', sectionController.getSections); // Вывод всех категорий
    app.get('/confirm/:verifyToken', verifyController.verify); // Верификация аккаунта пользователя
    /*Это должно быть в самом низу гет запросов*/
    
    app.post('/user/signUp', authController.signUp); // Регистрация
    app.post('/user/signIn', authController.signIn); // Авторизация
    app.post('/user/refresh-tokens', authController.refreshTokens); // рефреш токена
    app.post('/user/resetPassword', authMiddleware, verifyUserMiddleware, resetController.resetPassword); // Новый пароль
    app.post('/user/resetEmail', authMiddleware, verifyUserMiddleware, resetController.resetEmail); // Новый мейл
    app.post('/logout', authMiddleware, authController.logout); 

    app.listen(port, () => console.log(`Server has been started on port ${port}!`)); 
})


