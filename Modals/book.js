const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var moment = require('moment');
var todayDate = new Date();

const bookSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    auther: { type: String, required: true },
    copies: { type: Number, required: true },
    publication: { type: String, required: true },
    date: { type: String, default: moment(todayDate, 'DD-MM-YYYY').format('DD-MM-YYYY') },
    isbn: { type: String, required: true },
    year: { type: String, required: true },
    status: { type: String, required: true },
    del: { type: Boolean, default: false }
}, { timestamps: true });
const Books = mongoose.model('book', bookSchema, 'book');
module.exports = Books;