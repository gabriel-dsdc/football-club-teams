import TeamModel from '../database/models/Team';

class TeamService {
  private _allTeams: TeamModel[];

  async getAll() {
    this._allTeams = await TeamModel.findAll();
    return this._allTeams;
  }
}

export default TeamService;
