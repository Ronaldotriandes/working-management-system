import express, { RequestHandler, Router } from 'express';
import Joi from 'joi';
import { authMiddleware } from '../../middleware/auth.middleware';
import controller from './controller';
import { IWorkOrderBody } from './dto';
const router: Router = express.Router();
router.use(authMiddleware);

// Define validation schema
const bookVAlidate = Joi.object<IWorkOrderBody>({
  productName: Joi.string().required(),
  quantity: Joi.number().required(),
  deadline: Joi.date().required(),
  operatorId: Joi.number().required(),
});
const bookVAlidateUpdate = Joi.object<any>({
  // productName: Joi.string(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Canceled'),
  operatorId: Joi.number(),
});
const validateCreate: RequestHandler = (req, res, next) => {
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

router.post('/', validateCreate, controller.save);

router.get('/:id', controller.getById);

router.put('/:id', validateBookUpdate, controller.update);

router.delete('/:id', controller.delete);

export default router;
