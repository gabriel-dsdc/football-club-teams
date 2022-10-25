import { NextFunction, Request, Response } from 'express';
import schemas from './schemas';

const loginValidation = (req: Request, res: Response, next: NextFunction) => {
  const validation = schemas.loginSchema.validate(req.body);
  if (!validation.error) return next();

  res.status(400).json({ message: 'All fields must be filled' });
};

export default {
  loginValidation,
};
