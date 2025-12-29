const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017/");
let db;

async function connect() {
  await client.connect();
  db = client.db("corvees");
  console.log("-> MongoDB connecté");
}

function getDb() {
  return db;
}

module.exports = { connect, getDb };
