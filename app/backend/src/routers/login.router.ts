import * as express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();

const userController = new UserController();
router.post('/', (req, res) => userController.login(req, res));

export default router;
