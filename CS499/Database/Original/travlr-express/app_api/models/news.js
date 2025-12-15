/**
 * News Model
 * Defines the schema for news articles in the Travlr application
 * @module models/news
 */

const mongoose = require('mongoose');

/**
 * News Schema
 * @typedef {Object} NewsSchema
 * @property {string} code - Unique news code identifier (required, indexed)
 * @property {string} title - News article title (required)
 * @property {string} category - News category (required)
 * @property {string} author - Article author name (required)
 * @property {Date} publishDate - Publication date (required)
 * @property {string} image - Image URL/path for the article (required)
 * @property {string} summary - Brief summary/excerpt (required)
 * @property {string} content - Full article content (required)
 * @property {string[]} tags - Article tags for categorization
 * @property {boolean} featured - Whether article is featured (default: false)
 * @property {boolean} published - Publication status (default: true)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
const newsSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: [true, 'News code is required'],
        unique: true,
        index: true,
        trim: true,
        uppercase: true
    },
    title: { 
        type: String, 
        required: [true, 'News title is required'],
        index: true,
        trim: true
    },
    category: { 
        type: String, 
        required: [true, 'News category is required'],
        enum: ['Travel Tips', 'Destination Guide', 'Company News', 'Special Offers', 'Events', 'General'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    publishDate: { 
        type: Date, 
        required: [true, 'Publish date is required'],
        default: Date.now
    },
    image: { 
        type: String, 
        required: [true, 'News image is required']
    },
    summary: { 
        type: String, 
        required: [true, 'News summary is required'],
        maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    content: { 
        type: String, 
        required: [true, 'News content is required']
    },
    tags: [{
        type: String,
        trim: true
    }],
    featured: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

/**
 * News Model
 * @class News
 */
const News = mongoose.model('news', newsSchema);

module.exports = News;
