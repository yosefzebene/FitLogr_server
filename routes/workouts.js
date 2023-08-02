import { Router } from "express";
import * as workoutsController from '../controllers/workoutsController.js';
//Middleware
import auth from '../middleware/auth.js';
import { admin, user } from '../middleware/roles.js';

const workoutsRoutes = Router();

workoutsRoutes.route('/')
    .get([auth, user], workoutsController.getAllWorkouts)
    .post([auth, admin], workoutsController.createWorkouts);

workoutsRoutes.route('/:id')
    .get([auth, user], workoutsController.getSingleWorkout)
    .delete([auth, admin], workoutsController.deleteWorkout);

export default workoutsRoutes;
