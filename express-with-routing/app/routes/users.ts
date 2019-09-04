import { Router } from 'express';
import * as path from 'path';

const usersRouter = Router();

usersRouter.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'users.html'));
});

export { usersRouter };
