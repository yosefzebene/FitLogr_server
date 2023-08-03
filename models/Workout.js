import mongoose from "mongoose";

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        minLength: 20,
        maxLength: 2000,
        required: true
    }
});

export default mongoose.model('Workout', schema);
