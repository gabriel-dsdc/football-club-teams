import * as express from 'express';
import tokenMiddleware from '../middlewares/token.middleware';
import MatchController from '../controllers/match.controller';

const router = express.Router();

const matchController = new MatchController();
router.get('/', (req, res) => matchController.getAll(req, res));
router.post('/', tokenMiddleware, (req, res) => matchController.createMatch(req, res));
router.patch('/:id/finish', tokenMiddleware, (req, res) => matchController.finishMatch(req, res));

export default router;
