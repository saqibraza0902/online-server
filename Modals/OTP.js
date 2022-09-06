const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
   },
   code: { type: Number, required: true }
}, { timestamps: true });
const OTP = mongoose.model('otp', OTPSchema, 'otp');
module.exports = OTP;