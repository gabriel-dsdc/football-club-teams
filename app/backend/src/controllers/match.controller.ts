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

  async createMatch(req: Request, res: Response) {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = req.body;
    const newMatch = await this.service.createMatch(
      { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals },
    ) as { status: number, message: string };
    if (newMatch.message) {
      return res.status(newMatch.status).json({ message: newMatch.message });
    }
    res.status(201).json(newMatch);
  }

  async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    await this.service.finishMatch(Number(id));
    res.status(200).json({ message: 'Finished' });
  }

  async editMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const [editedMatch] = await this.service.editMatch(
      { id: Number(id), homeTeamGoals, awayTeamGoals },
    );
    res.status(200).json({ message: editedMatch ? 'Edited' : 'Not in Progress' });
  }
}

export default MatchController;
