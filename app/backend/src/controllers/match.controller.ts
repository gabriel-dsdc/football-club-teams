import { Request, Response } from 'express';
import MatchService from '../services/match.service';

class MatchController {
  protected service: MatchService;

  constructor() {
    this.service = new MatchService();
  }

  async getAll(_req: Request, res: Response) {
    const allMatches = await this.service.getAll();
    res.status(200).json(allMatches);
  }
}

export default MatchController;
