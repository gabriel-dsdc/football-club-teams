import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.service';

class LeaderboardController {
  protected service: LeaderboardService;

  constructor() {
    this.service = new LeaderboardService();
  }

  async getAll(_req: Request, res: Response) {
    const leaderboard = await this.service.getAll();
    res.status(200).json(leaderboard);
  }
}

export default LeaderboardController;
