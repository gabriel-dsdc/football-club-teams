import * as express from 'express';
import MatchController from '../controllers/match.controller';

const router = express.Router();

const matchController = new MatchController();
router.get('/', (req, res) => matchController.getAll(req, res));

export default router;
