import serverApp from './server.js';
import db  from './db/conn.js';

const port = process.env.port || 5000;
serverApp(db).listen(port, () => {
    console.log(`FitLogr server is listening on port ${port}`);
})
