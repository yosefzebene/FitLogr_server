import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRoutes = (database) => {
    const routes = Router();

    routes.post('/', authController.handleAuthentication(database));

    return routes;
}

export default authRoutes;