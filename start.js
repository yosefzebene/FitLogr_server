import app from "./server.js";
import connectDB from './db/conn.js';

// Connect to database
await connectDB().then(() => console.log('Database successfully connected'));

// Start the application
const port = process.env.port || 5000;
app.listen(port, () => {
    console.log(`FitLogr server is listening on port ${port}`);
})