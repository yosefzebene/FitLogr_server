import bcrypt from 'bcrypt';
import User from '../models/User.js';
import UserWorkout from '../models/UserWorkout.js';
import mongoose from 'mongoose';

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
            message: "Registration successful"
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

const getAllWorkouts = async (req, res) => {
    try {
        const query = { user_id: new mongoose.Types.ObjectId(req.user.id) };
        const result = await UserWorkout.find(query).populate('workout_id');

        res.status(200).send({
            status: "success",
            data: result,
            message: "All user's workouts"
        });
    }
    catch (e)
    {
        console.log(e.message);
        res.status(500).send({
            status: "error",
            code: 500,
            message: e.message
        });
    }
}

const addWorkoutsToPlan = async (req, res) => {
    try {
        req.body.forEach((e) => {
            e.user_id = new mongoose.Types.ObjectId(req.user.id)
            e.workout_id = new mongoose.Types.ObjectId(e.workout_id)
        });

        const options = {
            populate: ['workout_id']
        }
        const result = await UserWorkout.insertMany(req.body, options);

        res.status(201).json({
            status: "success",
            data: result,
            message: "Workouts successfully added"
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(400).json({
            status: "error",
            code: 400,
            message: e.message
        });
    }
}

const changeWorkoutDay = async(req, res) => {
    try {
        const query = {
            user_id: new mongoose.Types.ObjectId(req.user.id),
            workout_id: new mongoose.Types.ObjectId(req.body.workout_id),
            day: req.body.old_day
        }

        const doc = await UserWorkout.findOne(query);

        if (!doc) {
            return res.status(404).json({
                status: "error",
                code: 404,
                message: "Specified workout is not part of the users list - no updates were made"
            })
        }

        doc.day = req.body.new_day;

        const result = await doc.save();

        res.status(200).json({
            status: "success",
            data: result,
            message: "User Workout successfully updated"
        });
    }
    catch (e) 
    {
        console.log(e);
        res.status(400).json({
            status: "error",
            code: 400,
            message: e.message
        });
    }
}

export { createUser, getAllWorkouts, addWorkoutsToPlan, changeWorkoutDay };
