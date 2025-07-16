import express from 'express';
import { createUsers, deleteUserById, getAllUsers, getUsersById } from '../controllers/userController.js';

const router = express.Router();

router.post('/createUser', createUsers);
router.get('/getAllUsers', getAllUsers);
router.get('/getUserById/:id',getUsersById);
router.delete('/deleteUser/:id',deleteUserById);

export default router;
