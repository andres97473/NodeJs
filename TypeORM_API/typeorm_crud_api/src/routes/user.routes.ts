import { Router } from 'express';
import { getUsers, createUser, getUserId, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();


router.get('/users', getUsers );

router.get('/users/:id', getUserId );

router.post('/users', createUser );

router.put('/users/:id', updateUser );

router.delete('/users/:id', deleteUser );


export default router;
