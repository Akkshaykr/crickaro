// models/blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    images: {
        type: [String], // An array of strings for multiple images
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Sets default date to now
    },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
