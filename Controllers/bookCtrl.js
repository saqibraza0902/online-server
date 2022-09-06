const Book = require('../Modals/book');
const Borrows = require('../Modals/borrow')


const bookCtrl = {
    getBooks: async (req, res) => {
        try {
            const book = await Book.find()
            return res.send(book)
        } catch (error) {
            return res.status(500).json({ msg: 'error' })
        }
    },
    postBook: async (req, res) => {
        try {
            const { title, category, auther, copies, publication, isbn, year, status, date } = req.body;

            if (!title && !category && !auther && !copies && !publication && !isbn && !year && !status) {
                return res.status(400).json({ message: 'Please filled the field' })
            }
            const bookExist = await Book.findOne({ isbn: isbn })
            if (bookExist) {
                return res.status(400).json({ message: 'Book already exist' })
            }

            const postBook = new Book({ title, category, auther, copies, publication, isbn, year, status, date })
            await postBook.save();
            const book = await Book.find()
            return res.status(201).json({ message: 'Book Added', book })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    updateBook: async (req, res) => {
        try {
            const { title, category, auther, status, } = req.body;
            const id = req.params.id
            if (!title && !category && !auther && !status) {
                return res.status(400).json({ message: 'Please filled the field' })
            }


            const update = await Book.findByIdAndUpdate(id, { title, category, auther, status })
            if (!update) {
                return res.status(400).json({ message: "Do not updated Book" })
            }
            const book = await Book.find()
            return res.status(200).json({ message: 'Book Updated successfully', book })


        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    restoreBook: async (req, res) => {
        try {
            const id = req.params.id
            const restore = await Book.findByIdAndUpdate(id, { del: false })
            if (restore) {
                const book = await Book.find()
                return res.status(200).json({ message: 'Book has been restored', book })
            }
            return res.status(400).json({ message: 'Book did not update' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    DeleteRequest: async (req, res) => {
        try {
            const id = req.params.id
            const borrowRequest = await Borrows.find({ book: id }).populate('book')
            console.log(borrowRequest)
            if (borrowRequest.length === 0) {

                const updateBook = await Book.findByIdAndUpdate(id, { del: true })
                const book = await Book.find()
                return res.status(200).json({ message: 'Your request has been send to the admin', book })
            }
            return res.status(400).json({ message: 'You cant delete request borrow or borrowed book' })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    deleteBook: async (req, res) => {
        try {
            const id = req.params.id
            const deleteBook = await Book.findByIdAndRemove(id).exec()
            if (!deleteBook) {
                return res.status(400).json({ message: 'Book did not deleted' })
            }
            const book = await Book.find()
            return res.status(200).json({ message: 'Book deleted succesfully', book })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

module.exports = bookCtrl