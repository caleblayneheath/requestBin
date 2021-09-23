const { Client } = require('pg')

//const client = new Client({user: "pgtest", password: "pgtest", database: "request_bin"})

const client = new Client({database: "request_bin"}) 

async function foo() {
  await client.connect()
  const res = await client.query('SELECT * FROM bins')
  console.log(res.rows)
  await client.end()
}

foo();
