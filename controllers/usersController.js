import bcrypt from 'bcrypt';
import User from '../models/User.js';

const createUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(15);
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
            roles: [ "user" ]
        });

        const result = await user.save();

        console.log(`User document was inserted with _id: ${result._id}`)
        res.status(201).json({
            status: "success",
            data: result,
            message: "Authentication successful"
        });
    }
    catch (e) {
        console.log(e.message);
        res.status(400).send({
            status: "error",
            code: 400,
            message: e.message
        });
    }
}

export { createUser };
