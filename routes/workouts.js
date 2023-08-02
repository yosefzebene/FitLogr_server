import { Router } from "express";
import * as workoutsController from '../controllers/workoutsController.js';

const workoutsRoutes = Router();

workoutsRoutes.route('/')
    .get(workoutsController.getAllWorkouts)
    .post(workoutsController.createWorkouts);

workoutsRoutes.route('/:id')
    .get(workoutsController.getSingleWorkout)
    .delete(workoutsController.deleteWorkout);

export default workoutsRoutes;