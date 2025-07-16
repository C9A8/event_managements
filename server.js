import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/usersRouter.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api", usersRouter);
// app.use("/api/events", eventsRouter);
// app.use("/api/registrations", registrationsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
