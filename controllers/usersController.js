import bcrypt from 'bcrypt';
import db  from '../db/conn.js';

const createUser = async (req, res) => {
    try {
        const collection = db.collection("users");
        
        const salt = await bcrypt.genSalt(15);
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
            roles: [ "user" ]
        };

        const result = await collection.insertOne(user);

        console.log(`User document was inserted with _id: ${result.insertedId}`)
        res.status(201).json(result);
    }
    catch (e) {
        console.log(e);
    }
}

export { createUser };
