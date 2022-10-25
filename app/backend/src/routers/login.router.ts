import * as express from 'express';
import userMiddleware from '../middlewares/user.middleware';
import UserController from '../controllers/user.controller';

const router = express.Router();

const userController = new UserController();
router.post('/', userMiddleware.loginValidation, (req, res) => userController.login(req, res));

export default router;
