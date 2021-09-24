const express = require('express');
const router = express.Router();

const dbservice = require('../models/dbservice');

/*
curl -X POST http://localhost:3000/bin/test/ -H 'Content-Type: application/json' -d '{"login":"my_login","password":"my_password"}'
*/

router.all('/:id/new', async function(req, res) {
  //console.log("method", req.method)
  // console.log("body", req.body)
  //console.log("headers", req.headers)
  //console.log(req.header('x-forwarded-for') || req.connection.remoteAddress);
  // console.log(req.body) // for content:type json
  // console.log(JSON.parse(req.body.payload)) // for content:type urlformencoded
  // url => /test
  // originalUrl => '/bin/test'
  // baseUrl => /bin
  // method
  // body

  const binId = req.params.id;

  const valid = await dbservice.binExists(binId);

  if (valid) {
    const senderIp = await dbservice.insertRequest(binId, req);
    //await dbservice.updateBinRequestTotal(binId);
    res.render('index', { title: `request logged for ip:${senderIp}` });
  } else {
    res.render('index', { title: `bin ${binId} not found`});
  }
})

// GET /bins/new => Create a bin
router.get('/new', async function(req, res, next) {
  const id = await generateValidBinId();

  await dbservice.insertBin(id);

  // views need populating
  res.render('index', { title: `Your bin id is ${id}` });
});

// GET /bin/id/view => view bin requests
router.get('/:id/view', async function(req, res, next) {
  const binId = req.params.id;
  
  const valid = await dbservice.binExists(binId);

  if (valid) {

    const requests = await dbservice.getBinRequests(binId);
    console.log((requests));
    res.render('index', { title: JSON.stringify(requests)});
  } else {

    res.render('index', { title: 'no bin here' });
  }
});

// GET,POST,... /bins/id/new => save incoming requests
//router.all('/:id/new', function(req, res, next) {
//  res.render('index', { title: 'hello from binRouter' });
//});

async function generateValidBinId() {
  let binId = generateBinId();
  let invalid = await dbservice.binExists(binId);

  while (invalid) {
    binId = generateBinId();
    invalid = await dbservice.binExists(binId);
  }
  return binId;
}

function generateBinId() {
  const letters = 'abcefghijklmnopqrstuvwxyz'
  const characters = '0123456789' + letters 
  let result = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result;
}

module.exports = router;
