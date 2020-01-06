var express = require('express');
var router = express.Router();
var user_md = require('../models/user');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    var data = user_md.getAllUser();
    console.log(data);
    res.render('login');
});



module.exports = router;