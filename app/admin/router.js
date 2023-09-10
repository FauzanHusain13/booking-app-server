var express = require('express');
var router = express.Router();
const { viewSignIn, actionSignin } = require("./controller");

/* GET home page. */
router.get('/', viewSignIn);
router.post('/', actionSignin);

module.exports = router;