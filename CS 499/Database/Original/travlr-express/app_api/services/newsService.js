/**
 * News Service Layer
 * Business logic for news operations
 * @module services/newsService
 */

const News = require('../models/news');

/**
 * Get all news articles from database
 * @async
 * @function getAllNews
 * @returns {Promise<Array>} Array of all news articles
 * @throws {Error} Database error
 */
const getAllNews = async () => {
    return await News.find({}).sort({ publishDate: -1 }).exec();
};

/**
 * Get a single news article by code
 * @async
 * @function getNewsByCode
 * @param {string} newsCode - Unique news code
 * @returns {Promise<Object|null>} News object or null if not found
 * @throws {Error} Database error
 */
const getNewsByCode = async (newsCode) => {
    return await News.findOne({ code: newsCode }).exec();
};

/**
 * Create a new news article
 * @async
 * @function createNews
 * @param {Object} newsData - News data object
 * @returns {Promise<Object>} Created news object
 * @throws {Error} Validation or database error
 */
const createNews = async (newsData) => {
    const news = new News(newsData);
    return await news.save();
};

/**
 * Update an existing news article by code
 * @async
 * @function updateNews
 * @param {string} newsCode - Unique news code
 * @param {Object} newsData - Updated news data
 * @returns {Promise<Object|null>} Updated news object or null if not found
 * @throws {Error} Validation or database error
 */
const updateNews = async (newsCode, newsData) => {
    return await News.findOneAndUpdate(
        { code: newsCode },
        newsData,
        { new: true, runValidators: true }
    ).exec();
};

/**
 * Delete a news article by code
 * @async
 * @function deleteNews
 * @param {string} newsCode - Unique news code
 * @returns {Promise<Object|null>} Deleted news object or null if not found
 * @throws {Error} Database error
 */
const deleteNews = async (newsCode) => {
    return await News.findOneAndDelete({ code: newsCode }).exec();
};

module.exports = {
    getAllNews,
    getNewsByCode,
    createNews,
    updateNews,
    deleteNews
};
