const express = require('express');
const router = express.Router();

// GET /bins/new => Create a bin
router.get('/new', function(req, res, next) {
  // 1. generate a new 8 alphanumeric bin id until it's unique
  // 2. add it to the bins database
  // 3. return a view page with the bin id and instructions
  res.render('index', { title: 'hello from binRouter' });
});

// GET /bin/id/view => view bin requests
router.get('/:id/view', function(req, res, next) {
  res.render('index', { title: 'hello from binRouter' });
});

// GET,POST,... /bins/id/new => save incoming requests
router.all('/:id/new', function(req, res, next) {
  res.render('index', { title: 'hello from binRouter' });
});

//generate a bind id
//if in use
//  generate a new one

function generateValidBinId() {
  // get
  let binId = generateBinId();
  while (!validBindId(binId)) {
    binId = generateBinId();
  }
  return binId;
}

const validBindId = binId => {
  return true
}

function generateBinId() {
  const letters = 'abcefghijklmnopqrstuvwxyz'
  const characters = '0123456789' + letters + letters.toUpperCase()
  let result = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result;
}

module.exports = router;
