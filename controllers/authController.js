import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const handleAuthentication = async (req, res) => {
    try {

        const query = { email: req.body.email };
        const user = await User.findOne(query);
        if (!user)
            return res.status(401).send({
                status: "error",
                code: 401,
                message: "Invalid email or password"
            });

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid)
            return res.status(401).send({
                status: "error",
                code: 401,
                message: "Invalid email or password"
            });

        const token = jwt.sign({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            roles: user.roles,
        }, process.env.jwtPrivateKey, { expiresIn: "15m" });

        res.status(200).json({
            status: "success",
            data: {
                token: token
            },
            message: "Authentication successful"
        });
    }
    catch (e) {
        console.log(e);
    }
}

export { handleAuthentication };