/**
 * News Controller
 * Handles HTTP requests for news-related operations
 * @module controllers/news
 */

const newsService = require('../services/newsService');
const { asyncHandler, notFound } = require('../middleware/errorHandler');

/**
 * Get all news articles
 * @route GET /api/v1/news
 * @access Public
 */
const newsList = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const cursor = req.query.cursor || undefined;
    const search = req.query.q || undefined;
    const category = req.query.category || undefined;
    const featured = typeof req.query.featured === 'string' ? req.query.featured === 'true' : undefined;
    const published = typeof req.query.published === 'string' ? req.query.published === 'true' : true;

    const result = await newsService.getAllNews({
        limit,
        cursor,
        search,
        category,
        featured,
        published
    });
    res.status(200).json(result);
});

/**
 * Get a single news article by code
 * @route GET /api/v1/news/:newsCode
 * @access Public
 */
const newsFindByCode = asyncHandler(async (req, res) => {
    const news = await newsService.getNewsByCode(req.params.newsCode);
    
    if (!news) {
        throw notFound('News article');
    }
    
    res.status(200).json(news);
});

/**
 * Create a new news article
 * @route POST /api/v1/news
 * @access Private (Admin only)
 */
const newsAddNews = asyncHandler(async (req, res) => {
    const news = await newsService.createNews(req.body);
    res.status(201).json(news);
});

/**
 * Update an existing news article
 * @route PUT /api/v1/news/:newsCode
 * @access Private (Admin only)
 */
const newsUpdateNews = asyncHandler(async (req, res) => {
    const news = await newsService.updateNews(req.params.newsCode, req.body);
    
    if (!news) {
        throw notFound('News article');
    }
    
    res.status(200).json(news);
});

/**
 * Delete a news article
 * @route DELETE /api/v1/news/:newsCode
 * @access Private (Admin only)
 */
const newsDeleteNews = asyncHandler(async (req, res) => {
    const news = await newsService.deleteNews(req.params.newsCode);
    
    if (!news) {
        throw notFound('News article');
    }
    
    res.status(200).json({ 
        message: 'News article deleted successfully',
        news: news 
    });
});

module.exports = {
    newsList,
    newsFindByCode,
    newsAddNews,
    newsUpdateNews,
    newsDeleteNews
};
