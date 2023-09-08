var express = require('express');
var router = express.Router();

const { register, login } = require("./controller");

router.post('/', register)
router.post('/login', login)

module.exports = router;