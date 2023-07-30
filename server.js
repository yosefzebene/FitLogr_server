import express from 'express';
import cors from 'cors';
import './loadEnvironment.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

const serverApp = (database) => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    //load Routes
    app.use('/auth', authRoutes(database));
    app.use('/users', userRoutes(database));

    return app;
}

export default serverApp;
