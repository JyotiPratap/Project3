const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const book = new mongoose.Schema( {
    title: {
        required: true,
        type: String,
        unique: true,
        trim: true
    },
    excerpt: {
        required: true,
        type: String,
        trim: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "UserModel",
        trim: true
    },
    ISBN: {
        required: true,
        type: String,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        required: true,
        trim: true
    },
    review: {
        type: Number,
        default: 0,
        comment: {
            type: Number
        },
    },
    deletedAt: {
        type: Date,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,
        default:Date.now(),
        trim: true
    }
}, { timestamps: true });   
module.exports = mongoose.model('BookModel', book) 