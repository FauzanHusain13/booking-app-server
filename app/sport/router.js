var express = require('express');
var router = express.Router();
const { isLoginAdmin } = require("../middleware/auth")

const { index, viewCreate } = require("./controller");

router.use(isLoginAdmin)
router.get('/', index);
router.get('/add', viewCreate);

module.exports = router;