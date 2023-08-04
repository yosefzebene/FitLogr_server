import Workout from '../models/Workout.js';

const createWorkouts = async (req, res) => {
    try {
        const result = await Workout.insertMany(req.body);

        console.log("Workouts added: " + result);
        res.status(201).send({
            status: "success",
            data: result,
            message: "Workouts successfully added"
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
        const workouts = await Workout.find({});

        res.status(200).send({
            status: "success",
            data: workouts,
            message: "All workouts"
        });
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send({
            status: "error",
            code: 500,
            message: e.message
        });
    }
}

const getSingleWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id).exec();

        if (!workout) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "Resource does not exist."
            });
        }

        res.status(200).send({
            status: "success",
            data: workout,
            message: req.params.id + " loaded successfully"
        })
    }
    catch (e) {
        console.log(e.message);
        res.status(400).send({
            status: "error",
            code: 400,
            message: e.message
        })
    }
}

const deleteWorkout = async (req, res) => {
    try {
        const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);

        if (!deletedWorkout) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "Resource does not exist."
            });
        }

        res.status(200).send({
            status: "success",
            data: deletedWorkout,
            message: deletedWorkout.name + " workout deleted successfully"
        })
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

export { createWorkouts, getAllWorkouts, getSingleWorkout, deleteWorkout };
