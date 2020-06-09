const db = require('../db').getPool();
const { itemsOnPage } = require('../config/app');

exports.makeQuestion = async (topic, text, subsection, user) => {
    return db.promise().execute('INSERT INTO `questions` (`topic`, `text`, `subsection_id`, `user_id`) VALUES (?, ?, ?, ?)', [topic, text, subsection, user]);
}

exports.deleteQuestion = async (id) => {
    return db.promise().execute('DELETE FROM `questions` WHERE `id` = ?', [id]);
}

exports.getQuestion = async (id) => {
    const [[question]] = await db.promise().execute('SELECT `questions`.`id`, `user_id`, `topic`, `text`, `like_counter`, `sections`.`name` as `section_name`, `date`, `users`.`username` as `user_login` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id` = `subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` JOIN `users` ON `questions`.`user_id`=`users`.`id` WHERE `questions`.`id` = ?', [id]);
    return question;
}

exports.getUrlSection = async (url) => {
    const [urlSection] = await db.promise().execute('SELECT `url`, `name` FROM `sections` WHERE `url` = ?', [url]);
    return urlSection;
}

exports.getUrlSubsection = async (url) => {
    const [urlSubsection] = await db.promise().execute('SELECT `url`, `name` FROM `subsections` WHERE `url` = ?', [url]);
    return urlSubsection;
}

exports.getAllQuestions = async (pageNumber = 1) => {
    const [questions] = await db.promise().execute('SELECT `id`, `user_id`, `topic`, `text`, `like_counter`, `sections`.`name`, `subsection_id`, `date` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id` = `subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` LIMIT ? OFFSET ?', [itemsOnPage, (pageNumber - 1) * itemsOnPage]);
    return questions;
}

exports.getQuestionsSection = async (sectionName, pageNumber = 1) => {
    const [questions] = await db.promise().execute('SELECT `questions`.`id`, `user_id`, `topic`, `text`, `like_counter`, `sections`.`name`, `subsection_id`, `date` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id`=`subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` WHERE `sections`.`name` = ? LIMIT ? OFFSET ?', [sectionName, itemsOnPage, (pageNumber - 1) * itemsOnPage]);
    return questions;
}

exports.getQuestionsSubsection = async (subsectionName, pageNumber = 1) => {
    const [questions] = await db.promise().execute('SELECT `questions`.`id`, `user_id`, `topic`, `text`, `like_counter`, `sections`.`name`, `subsection_id`, `date` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id`=`subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` WHERE `subsections`.`name` = ? LIMIT ? OFFSET ?', [subsectionName, itemsOnPage, (pageNumber - 1) * itemsOnPage]);
    return questions;
}

exports.getQuestionsUser = async (id, pageNumber = 1) => {
    const [questions] = await db.promise().execute('SELECT `questions`.`id`, `questions`.`user_id`, `topic`, `text`, `like_counter`, `sections`.`name`, `subsection_id`, `date` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id`=`subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` WHERE `user_id` = ? LIMIT ? OFFSET ?', [id, itemsOnPage, (pageNumber - 1) * itemsOnPage]);
    return questions;
}

exports.getQuestionsToUserAnswers = async (id, pageNumber = 1) => {
    const [questions] = await db.promise().execute('SELECT DISTINCT `questions`.`id`, `questions`.`user_id`, `topic`, `questions`.`text`, `questions`.`like_counter`, `sections`.`name`, `subsection_id`, `questions`.`date` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id`=`subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` JOIN `answers` ON `questions`.`id`= `answers`.`question_id` WHERE `answers`.`user_id` = ? LIMIT ? OFFSET ?', [id, itemsOnPage, (pageNumber - 1) * itemsOnPage]);
    return questions;
}

exports.getQuestionsToUserAnswersCount = async (id) => {
    const [[{count}]] = await db.promise().execute('SELECT COUNT(DISTINCT `questions`.`id`) as `count` FROM `questions` JOIN `answers` ON `questions`.`id`= `answers`.`question_id` WHERE `answers`.`user_id` = ?', [id]);
    return count;
}

exports.getQuestionUserId = async (id) => {
    const [[{user_id}]] = await db.promise().execute('SELECT `user_id` FROM `questions` WHERE `id` = ?', [id]);
    return user_id;
}

exports.getQuestionsCount = async () => {
    const [[count]] = await db.promise().execute('SELECT COUNT(*) AS `count` FROM `questions`');
    return count;
}

exports.getQuestionSectionCount = async (id) => {
    const [[count]] = await db.promise().execute('SELECT COUNT(*) AS `count` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id` = `subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` WHERE `sections`.`name` = ?', [id]);
    return count;
}

exports.getQuestionSubsectionCount = async (id) => {
    const [[count]] = await db.promise().execute('SELECT COUNT(*) AS `count` FROM `questions` WHERE `subsection_id` = ?', [id]);
    return count;
}

exports.getUserQuestionsCount = async (id) => {
    const [[{count}]] = await db.promise().execute('SELECT COUNT(*) as `count` FROM `questions` WHERE `user_id` = ?', [id]);
    return count;
}

exports.getFoundQuestionsCount = async (text) => {
    const [[{count}]] = await db.promise().execute('SELECT COUNT(*) AS `count` FROM `questions` WHERE MATCH (`questions`.`topic`, `questions`.`text`) AGAINST (?)', [text]);
    return count;
}

exports.search = async (text, pageNumber = 1) => {
    const [questions] = await db.promise().query("SELECT `questions`.`id`, `user_id`, `topic`, `text`, `sections`.`name` as `section_name`, `date`, `users`.`username` as `user_login` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id` = `subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` JOIN `users` ON `questions`.`user_id`=`users`.`id` WHERE MATCH(`questions`.`topic`, `questions`.`text`) AGAINST (?) LIMIT ? OFFSET ?", [text, itemsOnPage, (pageNumber - 1) * itemsOnPage]);
    //const [[questions]] = await db.promise().query("SELECT `questions`.`id`, `user_id`, `topic`, `text`, `sections`.`name` as `section_name`, `date`, `users`.`username` as `user_login` FROM `questions` JOIN `subsections` ON `questions`.`subsection_id` = `subsections`.`name` JOIN `sections` ON `subsections`.`section_id`=`sections`.`name` JOIN `users` ON `questions`.`user_id`=`users`.`id` WHERE `questions`.`topic` LIKE " + text + " OR `questions`.`text` LIKE " + text + " LIMIT " + itemsOnPage + " OFFSET " + (pageNumber - 1) * itemsOnPage);
    //const [[questions]] = await db.promise().execute("SELECT * FROM `questions` WHERE `questions`.`topic` LIKE '?'", ['%'+text+'%']);
    return questions;
}
