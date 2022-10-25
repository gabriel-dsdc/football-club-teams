import TeamModel from '../database/models/Team';

class TeamService {
  private _team: TeamModel;
  private _allTeams: TeamModel[];

  async getAll() {
    this._allTeams = await TeamModel.findAll();
    return this._allTeams;
  }

  async getById(id: number): Promise<TeamModel> {
    this._team = await TeamModel.findByPk(id) as TeamModel;
    return this._team;
  }
}

export default TeamService;
