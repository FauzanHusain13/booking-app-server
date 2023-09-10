var express = require('express');
var router = express.Router();

const { updateToPro, postField, postPackage, postPayment, postTransaction, getHistory, getField, getDetailField, getDetailTransaction } = require("./controller");
const { isLoginUser } = require('../middleware/auth');

const multer = require("multer")
const upload = multer({ 
    dest: '/public/uploads/field',
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
})

// update to professional account
router.put('/professional', isLoginUser, updateToPro)

// feature for user with professional accout
router.post('/field', upload.single("imageField"), isLoginUser, postField)
router.post('/field/:fieldId/package', isLoginUser, postPackage)
router.post('/field/:fieldId/payment', isLoginUser, postPayment)

// user
router.get('/field', isLoginUser, getField)
router.get('/:fieldId/field', isLoginUser, getDetailField)
router.post('/transaction', isLoginUser, postTransaction)
router.get('/transaction', isLoginUser, getDetailTransaction)
router.get('/history', isLoginUser, getHistory)

module.exports = router;