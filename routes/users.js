import { Router } from 'express';
import * as usersController from '../controllers/usersController.js';

const userRoutes = (database) => {
    const routes = Router();

    routes.route('/create').post(usersController.createUser(database));

    return routes;
}

export default userRoutes;
