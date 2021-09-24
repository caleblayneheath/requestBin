const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
/*
curl -X POST http://localhost:3000/bin/test/ -H 'Content-Type: application/json' -d '{"login":"my_login","password":"my_password"}'
*/