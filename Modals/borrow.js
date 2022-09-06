const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var moment = require('moment');
var todayDate = new Date();
var bDate = new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)
const borrowSchema = new Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message: { type: String },
    borrowDate: { type: String, default: moment(todayDate, 'DD-MM-YYYY').format('DD-MM-YYYY') },
    issueDate: { type: String, default: '' },
    dueDate: { type: String, default: '' },
    status: { type: String, default: 'Pending', },
    returned: { type: Boolean, default: false },
    returnDate: { type: String, default: '' }
}, { timestamps: true });
const Borrows = mongoose.model('borrows', borrowSchema);
module.exports = Borrows;