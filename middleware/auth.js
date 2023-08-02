import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send({
            status: "error",
            code: 401,
            message: "Access denied. No Token Provided"
        });

    try {
        const decode = jwt.verify(token.split(" ")[1], process.env.jwtPrivateKey);
        req.user = decode;
    } catch (err) {
        return res.status(401).send({
            status: "error",
            code: 401,
            message: "Token expired or invalid"
        })
    }

    next();
}
