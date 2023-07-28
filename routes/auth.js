import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRoutes = Router();

authRoutes.post('/', authController.handleAuthentication);

export default authRoutes;