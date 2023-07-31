import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoServer = await MongoMemoryServer.create();
const uri = mongoServer.getUri();
const client = new MongoClient(uri);

let conn;
try {
    conn = await client.connect();
} catch(e) {
    console.error(e);
}

let test_db = conn.db("fitLogr");

export default test_db;
