import { Router } from 'express';
import * as usersController from '../controllers/usersController.js';

const userRoutes = Router();

userRoutes.route('/create').post(usersController.createUser);

export default userRoutes;
