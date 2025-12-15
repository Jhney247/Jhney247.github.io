/**
 * News Routes (API v1)
 * @module routes/v1/news
 */

const express = require('express');
const router = express.Router();
const newsController = require('../../controllers/news');
const { newsValidation } = require('../../middleware/validation');
const { authenticate, authorize } = require('../../middleware/auth');
const { writeLimiter } = require('../../middleware/rateLimiter');

/**
 * @route   GET /api/v1/news
 * @desc    Get all news articles
 * @access  Public
 */
router.get('/', newsController.newsList);

/**
 * @route   GET /api/v1/news/:newsCode
 * @desc    Get news article by code
 * @access  Public
 */
router.get('/:newsCode', newsController.newsFindByCode);

/**
 * @route   POST /api/v1/news
 * @desc    Create a new news article
 * @access  Private (Admin only)
 */
router.post(
    '/',
    authenticate,
    authorize('admin'),
    writeLimiter,
    newsValidation.create,
    newsController.newsAddNews
);

/**
 * @route   PUT /api/v1/news/:newsCode
 * @desc    Update news article by code
 * @access  Private (Admin only)
 */
router.put(
    '/:newsCode',
    authenticate,
    authorize('admin'),
    writeLimiter,
    newsValidation.update,
    newsController.newsUpdateNews
);

/**
 * @route   DELETE /api/v1/news/:newsCode
 * @desc    Delete news article by code
 * @access  Private (Admin only)
 */
router.delete(
    '/:newsCode',
    authenticate,
    authorize('admin'),
    writeLimiter,
    newsController.newsDeleteNews
);

module.exports = router;
