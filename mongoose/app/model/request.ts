import { User } from './user.model';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: User;
}
