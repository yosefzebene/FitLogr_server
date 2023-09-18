import { Router } from 'express';
import * as usersController from '../controllers/usersController.js';
//Middleware
import auth from '../middleware/auth.js';
import { admin, user } from '../middleware/roles.js';

const userRoutes = Router();

userRoutes.route('/create').post(usersController.createUser);

userRoutes.route('/me/workouts')
    .get([auth, user], usersController.getAllWorkouts)
    .post([auth, user], usersController.addWorkoutsToPlan)
    .patch([auth, user], usersController.changeWorkoutDay);

export default userRoutes;
