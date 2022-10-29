import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.service';

class LeaderboardController {
  protected service: LeaderboardService;

  constructor() {
    this.service = new LeaderboardService();
  }

  async homeLeaderboard(_req: Request, res: Response) {
    const leaderboard = await this.service.homeLeaderboard();
    res.status(200).json(leaderboard);
  }

  async awayLeaderboard(_req: Request, res: Response) {
    const leaderboard = await this.service.awayLeaderboard();
    res.status(200).json(leaderboard);
  }
}

export default LeaderboardController;
