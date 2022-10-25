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

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this.service.getById(Number(id));
    res.status(200).json(team);
  }
}

export default TeamController;
