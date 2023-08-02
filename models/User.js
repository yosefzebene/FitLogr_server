import mongoose from "mongoose";

const schema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    roles: [String],
    workouts: []
});

const User = mongoose.model('User', schema);

export default User;