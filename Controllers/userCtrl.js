const User = require('../Modals/user');
const mailer = require('../Services/mail')
const jwt = require('jsonwebtoken')
const BorrowMail = require('../Services/BorrowMail')
const userCtrl = {
    getUser: async (req, res) => {
        try {
            const user = await User.find()
            return res.send(user)
        } catch (error) {
            return res.status(500).json({ msg: 'error' })
        }
    },
    sendOTP: async (req, res) => {
        try {
            const { firstname, lastname, email, phone, status, role, password } = req.body;
            if (!firstname && !lastname && !email && !phone && !role && !password) {
                return res.status(400).json({ message: 'Please filled the field' })
            }
            const userExist = await User.findOne({ email: email })
            if (userExist) {
                return res.status(400).json({ message: 'User Already exist on this email' })
            }
            const token = jwt.sign(req.body, process.env.SECRET)
            const url = `http://localhost:3000/verify/${token}`
            mailer(email, url)
            return res.status(201).json({ message: "Please Check email to Verify Your account", token })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    postVerifiedUser: async (req, res) => {
        try {
            const { tokens } = req.body
            // const token = JSON.stringify(tokens)
            //    console.log(tokens)
            const verify = jwt.verify(tokens, process.env.SECRET)
            // console.log(verify)
            const user = new User(verify)
            user.save()
            res.status(200).json({ message: 'Your request has been send to the admin' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    approveUser: async (req, res) => {
        try {
            const id = req.params.id
            const approve = await User.findByIdAndUpdate(id, { status: 1 })
            if (!approve) {
                return res.status(404).send({ message: "Do not approve User" })
            }
            const user = await User.find()
            const newUser = await User.findById(id)
            const email = newUser?.email
            const name = newUser?.firstname
            const text = `Dear ${name} your request has been approved. Now you can login using your this email and default password is 'user'.`
            BorrowMail(email, text)
            return res.status(200).json({ message: 'User Approved successfully', user })

        } catch (error) {
            return res.status(500).json({ error: error.message })

        }
    },
    updateUser: async (req, res) => {
        try {
            const { firstname, lastname, email, phone, existingEmail } = req.body;
            const id = req.params.id
            if (!firstname || !lastname || !email || !phone) {
                return res.status(400).json({ message: "Please fill all the fields" })
            }
            if (email === existingEmail) {
                const update = await User.findByIdAndUpdate(id, { firstname, lastname, email, phone })
                if (!update) {
                    return res.status(404).send({ message: "Do not updated User" })
                }
                const user = await User.find()
                return res.status(200).json({ message: 'User Updated successfully', user })
            }

            const otherEmails = await User.find({ id, email: { $ne: existingEmail } })

            const emailExist = otherEmails.filter((a) => {
                return a.email === email
            })

            if (emailExist.length !== 0) {
                return res.status(400).json({ message: 'Email already exist' })
            }
            if (emailExist.length === 0) {
                const update = await User.findByIdAndUpdate(id, { firstname, lastname, email, phone })
                if (!update) {
                    return res.status(404).send({ message: "Do not updated User" })
                }
                const user = await User.find()
                return res.status(200).json({ message: 'User Updated successfully', user })
            }


        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    },
    updatePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body
            const id = req.params.id
            const finds = await User.findOne({ _id: id, password: oldPassword })
            // console.log(finds)
            if (!finds) {
                return res.status(400).json({ message: 'Your old Password is incorrect' })
            } else if (oldPassword === newPassword) {
                return res.status(400).json({ message: 'New Password and Old Password Can not be same' })
            } else if (finds) {
                const updatepwd = await User.findByIdAndUpdate(id, { password: newPassword })
                return res.status(200).json({ message: 'Password Updated successfully' })
            }
            return res.status(400).json({ message: 'Password did not Updated successfully' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const id = req.params.id
            const userMail = await User.findById(id)
            const email = userMail?.email
            const name = userMail?.firstname
            const text = `Dear ${name} admin has delete your account. For further details visit the admin office.`
            BorrowMail(email, text)
            const deleteUser = await User.findByIdAndRemove(id).exec()
            if (!deleteUser) {
                return res.status(400).json({ message: 'User did not deleted' })
            }
            const user = await User.find()
            return res.status(200).json({ message: 'User deleted succesfull', user })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}


module.exports = userCtrl