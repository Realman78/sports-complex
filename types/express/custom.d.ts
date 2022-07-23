import {Express} from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";
type decodedUser = {
    userId: string,
    mail: string,
    role: string,
    status: string
}
declare module 'express-serve-static-core' {
    interface Request {
      user?: decodedUser
    }
  }