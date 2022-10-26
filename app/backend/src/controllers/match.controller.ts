import { Request, Response } from 'express';
import MatchService from '../services/match.service';

class MatchController {
  protected service: MatchService;

  constructor() {
    this.service = new MatchService();
  }

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    const allMatches = await this.service.getAll(inProgress === 'true');
    res.status(200).json(allMatches);
  }
}

export default MatchController;
