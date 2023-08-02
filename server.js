import express from 'express';
import cors from 'cors';
import './loadEnvironment.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

//load Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

export default app;
