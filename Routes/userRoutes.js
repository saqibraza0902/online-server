const express = require('express');
const userCtrl = require('../controllers/userCtrl')
const loginCtrl = require('../Controllers/loginCtrl')
const router = require('express').Router()

router.get('/all/users', userCtrl.getUser)
router.post('/send/otp', userCtrl.sendOTP)
router.post('/post', userCtrl.postVerifiedUser)
router.patch('/update/:id', userCtrl.updateUser)
router.patch('/approve/:id', userCtrl.approveUser)
router.patch('/updatepwd/:id', userCtrl.updatePassword)
router.delete('/delete/:id', userCtrl.deleteUser)
router.post('/login/otp', loginCtrl.sendLoginOTP)
router.post('/login/verify', loginCtrl.login)
module.exports = router