const express = require('express');
const router = express.Router();
const bookCtrl = require('../Controllers/bookCtrl')

router.get('/all/books', bookCtrl.getBooks)
router.post('/post', bookCtrl.postBook)
router.patch('/update/:id', bookCtrl.updateBook)
router.patch('/delete/request/:id', bookCtrl.DeleteRequest)
router.patch('/restore/:id', bookCtrl.restoreBook)
router.delete('/delete/:id', bookCtrl.deleteBook)

module.exports = router