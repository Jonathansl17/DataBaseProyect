import express from 'express';
import cors from 'cors';

import basicRoutes from './routes/basic.routes.js'
import dbRoutes from './routes/db.routes.js'

const app = express();
const port = 3100;

app.use(cors());
app.use(express.json());

app.use('/hello', basicRoutes);
app.use('/connection', dbRoutes)



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});