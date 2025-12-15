/**
 * News Model
 * Defines the schema for news articles in the Travlr application
 * @module models/news
 */

const mongoose = require('mongoose');
const { auditPlugin } = require('../middleware/audit');

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
        uppercase: true,
        minlength: [3, 'News code must be at least 3 characters'],
        maxlength: [20, 'News code cannot exceed 20 characters']
    },
    title: { 
        type: String, 
        required: [true, 'News title is required'],
        index: true,
        trim: true,
        minlength: [5, 'News title must be at least 5 characters'],
        maxlength: [200, 'News title cannot exceed 200 characters']
    },
    category: { 
        type: String, 
        required: [true, 'News category is required'],
        enum: ['Travel Tips', 'Destination Guide', 'Company News', 'Special Offers', 'Events', 'General'],
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Author is required'],
        index: true
    },
    authorNameCached: {
        type: String,
        trim: true
    },
    publishDate: { 
        type: Date, 
        required: [true, 'Publish date is required'],
        default: Date.now,
        index: true
    },
    image: { 
        type: String, 
        required: [true, 'News image is required'],
        trim: true
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
        default: false,
        index: true
    },
    published: {
        type: Boolean,
        default: true,
        index: true
    },
    // optional relationship to a trip
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trips',
        index: true,
        required: false
    },
    schemaVersion: {
        type: Number,
        required: true,
        default: 1,
        index: true,
        min: 1
    }
}, {
    timestamps: true
});

newsSchema.plugin(auditPlugin, { collection: 'news' });

newsSchema.index({ published: 1, publishDate: -1 });
newsSchema.index({ category: 1, publishDate: -1 });
newsSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

newsSchema.pre('validate', function(next) {
    if (!this.schemaVersion) {
        this.schemaVersion = 1;
    }
    if (!this.authorNameCached && this.populated && this.populated('author')) {
        const author = this.author;
        if (author && author.name) {
            this.authorNameCached = author.name;
        }
    }
    if (this.summary && this.content && this.summary === this.content) {
        this.invalidate('summary', 'Summary should be a brief excerpt, not the full content');
    }
    next();
});

/**
 * News Model
 * @class News
 */
const News = mongoose.model('news', newsSchema);

module.exports = News;
