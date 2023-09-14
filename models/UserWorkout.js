import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workout_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout',
        required: true
    },
    day: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    }
});

const UserWorkout = mongoose.model('UserWorkout', schema);

export default UserWorkout;