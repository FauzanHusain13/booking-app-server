var express = require('express');
var router = express.Router();

const { updateToPro, postField, deleteField, postPackage, deletePackage, postPayment, deletePayment, postTransaction, getHistory, getField, getDetailField, getDetailTransaction, getAllLocation, editLocation, searchField } = require("./controller");
const { isLoginUser } = require('../middleware/auth');

const multer = require("multer")
const upload = multer({ 
    dest: '/public/uploads/field',
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
})

// edit account
router.get('/location', isLoginUser, getAllLocation)
router.put('/location', isLoginUser, editLocation)
router.put('/professional', isLoginUser, updateToPro)

// feature for user with professional accout
router.post('/field', upload.single("imageField"), isLoginUser, postField)
router.delete('/field/:fieldId', isLoginUser, deleteField)

router.post('/field/:fieldId/package', isLoginUser, postPackage)
router.delete('/field/:fieldId/package/:packageId', isLoginUser, deletePackage)

router.post('/field/:fieldId/payment', isLoginUser, postPayment)
router.delete('/field/:fieldId/payment/:paymentId', isLoginUser, deletePayment)

// user
router.post('/field/search', isLoginUser, searchField)
router.get('/field', isLoginUser, getField)
router.get('/:fieldId/field', isLoginUser, getDetailField)
router.post('/transaction', isLoginUser, postTransaction)
router.get('/transaction', isLoginUser, getDetailTransaction)
router.get('/history', isLoginUser, getHistory)

module.exports = router;