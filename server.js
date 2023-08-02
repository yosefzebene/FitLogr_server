import express from 'express';
import cors from 'cors';
import './loadEnvironment.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

const port = process.env.port || 5000;
const app = express();

app.use(cors());
app.use(express.json());

//load Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`FitLogr server is listening on port ${port}`);
})
