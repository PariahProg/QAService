const db = require('../db').getPool();
const { itemsOnPage } = require('../config/app');

exports.makeAnswer = async (text, question, user) => {
    return db.promise().execute('INSERT INTO `answers` (`text`, `question_id`, `user_id`) VALUES (?, ?, ?)', [text, question, user]);
}

exports.deleteAnswer = async (id) => {
    return db.promise().execute('DELETE FROM `answers` WHERE id = ?', [id]);
}

exports.getAnswersUser = async (id, pageNumber = 1) => {
    const [answers] = await db.promise().execute("SELECT `answers`.`id`, `answers`.`user_id`, `answers`.`text`, `answers`.`like_counter`, `answers`.`question_id` FROM `answers` WHERE `user_id` = ? LIMIT ? OFFSET ?", [id, itemsOnPage, (pageNumber - 1) * itemsOnPage]);
    return answers;
}

exports.getAnswerUserId = async (id) => {
    const [[{user_id}]] = await db.promise().execute('SELECT `user_id` FROM `answers` WHERE `id` = ?', [id]);
    return user_id;
}

exports.getLikedUserId = async (id) => {
    const [[{user_id}]] = await db.promise().execute('SELECT `user_id` FROM `user_likes` WHERE `user_id` = ?', [id]);
    return user_id;
}

exports.getAnswersToQuestion = async (id, pageNumber = 1) => {
    const [answers] = await db.promise().execute("SELECT `answers`.`id`, `answers`.`user_id`, `answers`.`text`, `answers`.`like_counter`, `users`.`username` FROM `answers` JOIN `questions` on `answers`.`question_id`=`questions`.`id` JOIN `users` ON `answers`.`user_id`=`users`.`id` WHERE `questions`.`id` = ? LIMIT ? OFFSET ?", [id, itemsOnPage, (pageNumber - 1) * itemsOnPage]);
    return answers;
}

exports.getAnswersCount = async (id) => {
    const [answersCount] = await db.promise().execute('SELECT COUNT(*) as `answersCount` FROM `answers` WHERE `question_id` = ?', [id]);
    return answersCount;
}

exports.getAnswersUserCount = async (user_id) => {
    const [[{answersCount}]] = await db.promise().execute('SELECT COUNT(*) as `answersCount` FROM `answers` WHERE `user_id` = ?', [user_id]);
    return answersCount;
}

exports.setLikeAnswer = async (id) => {
    return db.promise().execute('UPDATE `answers` SET `like_counter` = `like_counter` + 1 WHERE `id` = ?', [id]);
}

exports.setDislikeAnswer = async (id) => {
    return db.promise().execute('UPDATE `answers` SET `like_counter` = `like_counter` - 1 WHERE `id` = ?', [id]);
}

exports.addUserLike = async (user_id, answer_id) => {
    return db.promise().execute('INSERT INTO `user_likes` (user_id, answer_id) VALUES (?, ?)', [user_id, answer_id]);
}

exports.removeUserLike = async (user_id, answer_id) => {
    return db.promise().execute('DELETE FROM `user_likes` WHERE `user_id` = ? AND `answer_id` = ?', [user_id, answer_id]);
}

exports.getLikedAnswers = async () => {
    const [likedAnswers] = await db.promise().execute('SELECT `answers`.`id` FROM `answers` JOIN `user_likes` ON `answers`.`id`=`user_likes`.`answer_id` WHERE `user_likes`.`answer_id` = `answers`.`id`');
    return likedAnswers;
}




