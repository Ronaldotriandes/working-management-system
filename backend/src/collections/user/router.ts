import express, { NextFunction, RequestHandler, Router } from 'express';
import Joi from 'joi';
import controller from './controller';
import { IUserReqBody } from './dto';
import User from './model';
const router: Router = express.Router();

// Define validation schema
const bookVAlidate = Joi.object<IUserReqBody>({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  roleId: Joi.string().required(),
});
const bookVAlidateUpdate = Joi.object<IUserReqBody>({
  username: Joi.string(),
  password: Joi.string(),
  fullName: Joi.string(),
  email: Joi.string().email(),
  roleId: Joi.string(),
});
const validateBookCreate: RequestHandler = (req, res, next) => {
  const { error } = bookVAlidate.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    res.status(400).json({
      status: false,
      message: 'Error Validation',
      errors,
    });
  }
  next();
};

const validateBookUpdate: RequestHandler = (req, res, next) => {
  const { error } = bookVAlidateUpdate.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    res.status(400).json({
      status: false,
      message: 'Error Validation',
      errors,
    });
  }
  next();
};
// Routes
router.get('/', controller.getAllData);

router.post('/', validateBookCreate, controller.save);

router.get('/:id', controller.getById);

router.put('/:id', validateBookUpdate, controller.update);

router.delete('/:id', controller.delete);

export default router;
