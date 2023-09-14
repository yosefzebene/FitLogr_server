import mongoose from "mongoose";

const schema = new mongoose.Schema({
    first_name: { 
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        validate: v => Array.isArray(v) && v.length > 0
    }
});

const User = mongoose.model('User', schema);

export default User;