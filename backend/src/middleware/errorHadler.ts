import { NextFunction, Request, Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../lib/error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({
      status: false,
      message: err.message,
    });
  }
  else if (err instanceof UnauthorizedError) {
    res.status(401).json({
      status: false,
      message: err.message,
    });
  }  else if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(400).json({
      status: false,
      message: 'Duplicate entry',
    });
  }
  else {
    console.log(err)
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};