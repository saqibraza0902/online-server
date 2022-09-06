const Borrows = require('../Modals/borrow')
const Book = require('../Modals/book')
const moment = require('moment')
const BorrowMail = require('../Services/BorrowMail')
const borrowCtrl = {
    getBorrow: async (req, res) => {
        try {
            const borrow = await Borrows.find().populate('user').populate('book')
            return res.send(borrow)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getUserBorrow: async (req, res) => {
        try {
            const { user } = req.body
            const borrow = await Borrows.find({ user: user }).populate('user').populate('book')
            res.json(borrow)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    postBorrow: async (req, res) => {
        try {
            const { book, user, message, issueDate, dueDate, status, returned, returnDate } = req.body
            if (!book || !user) {
                return res.status(400).json({ message: 'Please fill all fields' })
            }
            const todayDate = new Date();
            const borrowDate = moment(todayDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
            // console.log(returned)    
            const newBorrow = new Borrows({
                book, user, message, borrowDate, issueDate, dueDate, status, returned, returnDate
            })

            await newBorrow.save()

            return res.status(200).json({ message: 'Borrowed Successfully' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    approveBorrow: async (req, res) => {
        try {
            const { book } = req.body
            const todayDate = new Date();
            const issueDate = moment(todayDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
            var dueDate = moment(todayDate, 'DD-MM-YYYY').add(7, "days").format('DD-MM-YYYY')
            const id = req.params.id
            console.log(id, book)
            const approveBorrow = await Borrows.findByIdAndUpdate({ _id: id }, { dueDate, issueDate, status: 'Approved' })
            const removeCopy = await Book.findByIdAndUpdate({ _id: book }, { $inc: { copies: -1 } })
            if (!approveBorrow && !removeCopy) {
                res.status(400).json({ message: 'Approve Failed' })
            }
            const borrows = await Borrows.findById({ _id: id }).populate('user').populate('book')
            const bok = borrows?.book?.title
            const email = borrows?.user?.email
            const name = borrows?.user?.firstname
            const text = `Dear ${name} admin has been approve your request of book ${bok}`
            BorrowMail(email, text)
            const borrow = await Borrows.find().populate('user').populate('book')
            res.status(200).json({ message: 'Book has been Approved', borrow })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    DisapproveBorrow: async (req, res) => {
        try {
            const id = req.params.id
            const borrow = await Borrows.findById({ _id: id }).populate('user').populate('book')

            const book = borrow?.book?.title
            const email = borrow?.user?.email
            const name = borrow?.user?.firstname
            const text = `Dear ${name} admin has been disapprove your request of book ${book}`
            BorrowMail(email, text)
            const del = await Borrows.findByIdAndDelete({ _id: id })
            if (del) {
                const borrows = await Borrows.find().populate('user').populate('book')
                res.status(200).json({ message: 'Request has been disapproved', borrows })
            }
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    ReturnBorrow: async (req, res) => {
        const { bookId } = req.body
        try {
            const todayDate = new Date();
            const returnDate = moment(todayDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
            const id = req.params.id
            await Borrows.findByIdAndUpdate({ _id: id }, { returned: true, returnDate: returnDate })
            await Book.findByIdAndUpdate({ _id: bookId }, { $inc: { copies: 1 } })
            const borrow = await Borrows.find().populate('user').populate('book')
            return res.status(201).json({ message: 'Returned Successfully', borrow })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    DeleteBorrow: async (req, res) => {
        try {

            setTimeout(async() => {
                const result = await Borrows.deleteMany({ returned: true })
                console.log("Deleted " + result.deletedCount + " documents");
            }, 604800000);
             
            // const id = req.params.id
            // const result = await Borrows.findById(id)
           
            // console.log(result)
           
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}
module.exports = borrowCtrl