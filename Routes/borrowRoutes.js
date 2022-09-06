const express = require('express');
const router = express.Router();
const borrowCtrl = require('../controllers/borrowCtrl')

router.get('/all/borrows', borrowCtrl.getBorrow)
router.post('/user/borrow', borrowCtrl.getUserBorrow)
router.post('/post', borrowCtrl.postBorrow)
router.patch('/approve/:id', borrowCtrl.approveBorrow)
router.delete('/delete/:id', borrowCtrl.DisapproveBorrow)
router.patch('/update/:id', borrowCtrl.ReturnBorrow)
router.delete('/delete/borrow/:id', borrowCtrl.DeleteBorrow)
// router.post('/updateCopy/:id', borrowCtrl.updateCopies)

module.exports = router