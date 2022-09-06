const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: Number, required: true },
    status: { type: Number, default: 0 },
    password: { type: String, required: true }
}, { timestamps: true });
const User = mongoose.model('user', userSchema, 'user');
module.exports = User;