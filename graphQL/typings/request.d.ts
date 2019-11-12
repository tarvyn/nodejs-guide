import { User } from '../app/models/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: User['id'];
    isAuthenticated: boolean;
  }
}
