import * as express from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const router = express.Router();

const leaderboardController = new LeaderboardController();
router.get('/home', (req, res) => leaderboardController.homeLeaderboard(req, res));
router.get('/away', (req, res) => leaderboardController.awayLeaderboard(req, res));
router.get('/', (req, res) => leaderboardController.leaderboard(req, res));

export default router;
