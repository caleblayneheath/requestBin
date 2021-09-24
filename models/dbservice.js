const { Client, Pool } = require('pg')
const dotenv = require('dotenv');
dotenv.config();

class DatabaseService {
  constructor() {
    this.client = new Pool({
      user: process.env.DB_USER, 
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME,
    });
  }
  
  async allBins() {
    const sql = 'SELECT * FROM bins';
    const result = await this.client.query(sql);
    return result.rows;
  }

  // assume you've validated this url(proper format and not already in bins table)
  async insertBin(url) {
    const sql = 'INSERT INTO bins (url) VALUES($1)';
    const result = await this.client.query(sql, [url]);
    return result.rowCount; // successful insert should return 1
  }

  async getBin(url) {
    const sql = 'SELECT * FROM bins WHERE url=$1';
    const result = await this.client.query(sql, [url]);
    return result.rows[0];
  }

  async binExists(url) {
    const sql = 'SELECT EXISTS(SELECT 1 FROM bins WHERE url=$1)';
    const result = await this.client.query(sql, [url]);
    return result.rows[0].exists;
  }

  async getBinRequests(url) {
    const bin = await this.getBin(url);
    const sql = 'SELECT * FROM request_data WHERE bin_id=$1';
    const result = await this.client.query(sql, [bin.id]);
    return result.rows;
  }

  /*
  bin_id int
  header_content json
  body json
  method text not null
  sender_ip text not null

  from res object
    headers
    method
    body or rawbody
    header('x-forwarded-for') || req.connection.remoteAddress;
  */

  // insert request
  // get bin and update count
  async insertRequest(url, req) {
    const { method, body } = req;
    const header_content = req.headers;
    const sender_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const bin = await this.getBin(url);
    const bin_id = bin.id;

    const insert = {
      text: 'INSERT INTO request_data (bin_id, header_content, body, method, sender_ip) VALUES($1, $2, $3, $4, $5)',
      values: [bin_id, header_content, body, method, sender_ip],
    }

    await this.client.query(insert);
    return sender_ip;
  }

  // async updateBinRequestTotal(url) {
  //   const bin = await this.getBin(url);
  //   const bin_id = bin.id;

  //   const select = 'SELECT COUNT(id) FROM request_data WHERE bin_id = $1';
  //   const totalRequests = await this.client.query(select, [bin_id]);

  //   const update = 'UPDATE bins SET quantity_requests = $1 WHERE id = $2';
  //   await this.client.query(update, [totalRequests, bin_id]);
  //   return totalRequests;
  // }
}

let db = new DatabaseService();
// db.insertBin('sdhjxsdf134').then(r => console.log(r));

// db.getBinRequests('s').then(r => console.log(r));
const url = 'sdhjxsdf';
//db.ifBinExists(url).then(r => console.log(r));

// db.getBin(url).then(r => console.log(r));
module.exports = db;


