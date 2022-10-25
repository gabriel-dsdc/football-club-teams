import * as express from 'express';
import TeamController from '../controllers/team.controller';

const router = express.Router();

const teamController = new TeamController();
router.get('/', (req, res) => teamController.getAll(req, res));

export default router;
