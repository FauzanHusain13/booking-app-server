var express = require('express');
var router = express.Router();

const { updateToPro, postField, deleteField, postPackage, deletePackage, postPayment, deletePayment, postTransaction, getHistory, getField, getDetailField, getDetailTransaction, getAllLocation, searchField, editProfile, getMyfield, getDetailSchedule, getSchedules, getAllSport } = require("./controller");
const { isLoginUser, isProUser } = require('../middleware/auth');

const multer = require("multer")
const upload = multer({ 
    dest: '/public/uploads/field',
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
})

// edit account
router.get('/location', getAllLocation)
router.get('/sport', getAllSport)
router.put('/edit', isLoginUser, editProfile)
router.put('/professional', isLoginUser, updateToPro)

// feature for user with professional accout
router.post('/field', upload.single("imageField"), isLoginUser, isProUser, postField)
router.delete('/field/:fieldId', isLoginUser, isProUser, deleteField)

router.post('/field/:fieldId/package', isLoginUser, isProUser, postPackage)
router.delete('/field/:fieldId/package/:packageId', isLoginUser, isProUser, deletePackage)

router.post('/field/:fieldId/payment', isLoginUser, isProUser, postPayment)
router.delete('/field/:fieldId/payment/:paymentId', isLoginUser, isProUser, deletePayment)

router.get('/myfields', isLoginUser, isProUser, getMyfield)
router.get('/schedules/:fieldId', isLoginUser, isProUser, getSchedules)
router.get('/schedule/:fieldId/:transactionId', isLoginUser, isProUser, getDetailSchedule)

// user
router.post('/field/search', isLoginUser, searchField)
router.get('/field', isLoginUser, getField)
router.get('/:fieldId/field', isLoginUser, getDetailField)
router.post('/transaction', isLoginUser, postTransaction)
router.get('/transaction', isLoginUser, getDetailTransaction)
router.get('/history', isLoginUser, getHistory)

module.exports = router;