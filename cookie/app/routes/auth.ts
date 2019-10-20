import express = require('express');
import { getLogin, postLogin, postLogout } from '../controllers/auth';

export const authRoutes = express.Router();

authRoutes.get('/login', getLogin);

authRoutes.post('/login', postLogin);

authRoutes.post('/logout', postLogout);
