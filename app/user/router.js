var express = require('express');
var router = express.Router();

const { updateToPro, postField, postPackage, postPayment, transaction } = require("./controller");
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

// professional feature
router.post('/field', upload.single("imageField"), isLoginUser, postField)
router.post('/field/:fieldId/package', isLoginUser, postPackage)
router.post('/field/:fieldId/payment', isLoginUser, postPayment)

// user transaction
router.post('/transaction', isLoginUser, transaction)

module.exports = router;