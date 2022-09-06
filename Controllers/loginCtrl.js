const User = require('../Modals/user');
const jwt = require('jsonwebtoken')
const OTPmailer = require('../Services/OTPMail')
const OTP = require('../Modals/OTP')

const loginCtrl = {
    sendLoginOTP: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email, password, status: 1 })
            // const token = jwt.sign({ user }, process.env.SECRET)
            // const role = user?.role
            if (user) {
                const otpCode = Math.floor(Math.random() * 10000 + 1);
                let otpData = new OTP({ user: user._id, code: otpCode, })
                const otp = JSON.stringify(otpCode)
                await otpData.save();
                OTPmailer(email, otp)
                return res.status(200).json({ message: 'Ok', id: user._id })
            } else {
                return res.status(400).json({ message: 'Invalid Email or Password', id: null })
            }

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const { user, code } = req.body
            const check = await OTP.findOne({ code: code })
            if (!check) {
                return res.status(400).json({ message: 'Invalid Otp' })
            }
            
            const userDetail = await OTP.findOne({ code: code, user: user }).populate('user')
            const newUser = userDetail?.user
            const token = jwt.sign({ user:newUser }, process.env.SECRET)
            const role = userDetail?.user?.role
            console.log(userDetail.user.role)
            await OTP.findOneAndDelete({ code: code })
            return res.status(200).json({ message:'Successfully Login' , token, role})
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

module.exports = loginCtrl