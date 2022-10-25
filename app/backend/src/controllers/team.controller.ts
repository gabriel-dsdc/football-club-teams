import { Request, Response } from 'express';
import TeamService from '../services/team.service';

class TeamController {
  protected service: TeamService;

  constructor() {
    this.service = new TeamService();
  }

  async getAll(_req: Request, res: Response) {
    const allTeams = await this.service.getAll();
    res.status(200).json(allTeams);
  }
}

export default TeamController;
