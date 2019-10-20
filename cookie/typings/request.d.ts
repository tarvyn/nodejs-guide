import { User, UserInfo } from '../app/model/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

declare global {
  namespace Express {
    interface SessionData {
      isLoggedIn?: boolean;
      user?: UserInfo;
    }
  }
}
