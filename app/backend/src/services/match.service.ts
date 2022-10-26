import TeamModel from '../database/models/Team';
import MatchModel from '../database/models/Match';

class MatchService {
  private _allMatches: MatchModel[];

  async getAll() {
    this._allMatches = await MatchModel.findAll(
      { include: [
        { model: TeamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ] },
    );
    return this._allMatches;
  }
}

export default MatchService;
