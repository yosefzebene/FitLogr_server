import bcrypt from 'bcrypt';

const createUser = (db) => {
    return async (req, res) => {
        try {
            // if (req.body.first_name === "" || req.body.last_name === "" || 
            // req.body.email === "" || req.body.password === "")
            //     return res.status(400).send({
            //         status: "error",
            //         code: 400,
            //         message: "All fields must be provided"
            //     })

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
            res.status(201).send({
                status: "success",
                data: result,
                message: "User registration is successful",
            });
        }
        catch (e) {
            console.log(e);
        }
    }
}

export { createUser };
