import { Router } from 'express';
import * as path from 'path';

const adminRouter = Router();

adminRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
});

export { adminRouter };
