import express, { RequestHandler, Router } from 'express';
import Joi from 'joi';
import { IUserReqBody } from '../user/dto';
import controller from './controller';
import { IAuthBody } from './dto';
const router: Router = express.Router();

// Define validation schema
const bookVAlidate = Joi.object<IAuthBody>({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});
const registerValidate = Joi.object<IUserReqBody>({
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  roleId: Joi.string().required(),
});
const validateRegister: RequestHandler = (req, res, next) => {
  const { error } = registerValidate.validate(req.body, { abortEarly: false });
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


// Routes

router.post('/login', validateBookCreate, controller.login);
router.post('/register', validateRegister, controller.register);


export default router;
