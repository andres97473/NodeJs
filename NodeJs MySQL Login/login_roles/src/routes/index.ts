import { Router } from 'express';

import auth from './auth';
import user from './user';

const routes = Router();

// localhost:3000/auth/login
routes.use('/auth', auth)

// localhost:3000/users
// localhost:3000/users/id
routes.use('/users', user)

export default routes;