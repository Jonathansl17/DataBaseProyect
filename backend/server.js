import express from 'express';
import cors from 'cors';

import basicRoutes from './routes/basic.routes.js'
import dbRoutes from './routes/db.routes.js'
import viewRoutes from './routes/views.routes.js'

const app = express();
const port = 3100;

app.use(cors());
app.use(express.json());

app.use('/hello', basicRoutes);
app.use('/connection', dbRoutes)
app.use('/views', viewRoutes)



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});