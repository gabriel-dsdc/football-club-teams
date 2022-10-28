import { Request, Response } from 'express';
import MatchService from '../services/match.service';

class MatchController {
  protected service: MatchService;

  constructor() {
    this.service = new MatchService();
  }

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    const inProgressQuery = inProgress ? inProgress === 'true' : undefined;
    const allMatches = await this.service.getAll(inProgressQuery);
    res.status(200).json(allMatches);
  }
}

export default MatchController;
