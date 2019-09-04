import express = require('express');
import * as path from 'path';
import { adminRouter } from './routes/admin';
import { usersRouter } from './routes/users';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRouter);
app.use(usersRouter);

app.listen(3000);
