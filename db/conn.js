import { MongoClient } from 'mongodb';

const uri = process.env.db_uri;
const client = new MongoClient(uri);

let conn;
try {
    conn = await client.connect();
} catch(e) {
    console.error(e);
}

let db = conn.db("fitLogr");

export default db;
