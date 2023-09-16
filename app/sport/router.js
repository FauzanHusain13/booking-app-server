var express = require('express');
var router = express.Router();
const { isLoginAdmin } = require("../middleware/auth")

const { index, viewCreate, actionCreate, viewEdit, actionEdit } = require("./controller");

router.use(isLoginAdmin)
router.get('/', index);
router.get('/add', viewCreate);
router.post('/add', actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', actionEdit);

module.exports = router;