import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';

const tokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const userService = new UserService();
  try {
    const token = req.header('Authorization');
    const payload = userService.verifyToken(token as string);
    res.locals.payload = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default tokenValidation;
