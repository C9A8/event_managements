import express from 'express';
import dotenv from 'dotenv';
import { usersRouter } from './routes/usersRouter.js';
import { eventRoutes } from './routes/eventsRouter.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api", usersRouter);
 app.use("/api", eventRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
