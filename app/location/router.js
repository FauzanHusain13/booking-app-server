var express = require('express');
var router = express.Router();

const { index, viewCreate, actionCreate, actionDelete } = require("./controller");

router.get('/', index);
router.get('/add', viewCreate);
router.post('/add', actionCreate)
router.delete("/delete/:id", actionDelete)

module.exports = router;