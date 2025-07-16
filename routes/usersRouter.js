import express from 'express';
import { 
    createUsers,
    deleteUserById,
    getAllUsers,
    getUsersById  
} from '../controllers/userController.js';

export const usersRouter = express.Router();

usersRouter.post('/createUser', createUsers);
usersRouter.get('/getAllUsers', getAllUsers);
usersRouter.get('/getUserById/:id',getUsersById);
usersRouter.delete('/deleteUser/:id',deleteUserById);


