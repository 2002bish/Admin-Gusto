import express from 'express';
import { registerUser, loginUser, getUserById, updateUser, deleteUser } from "../controllers/userController.js"
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', isAdmin, getUserById);
router.put('/:id', isAdmin, updateUser);
router.delete('/:id', isAdmin, deleteUser);

export default router;
