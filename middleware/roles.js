const admin = (req, res, next) => {
    if (!req.user.roles.includes("admin"))
        return res.status(403).send({
            status: "error",
            code: 403,
            message: "Access denied."
        });
    
    next();
}

const user = (req, res, next) => {
    if (!req.user.roles.includes("user"))
        return res.status(403).send({
            status: "error",
            code: 403,
            message: "Access denied."
        });
    
    next();
}

export { admin, user };
