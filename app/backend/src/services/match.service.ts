import TeamModel from '../database/models/Team';
import MatchModel from '../database/models/Match';

class MatchService {
  private _allMatches: MatchModel[];

  async getAll(inProgress: boolean | undefined) {
    let findAllOptions;
    if (inProgress !== undefined) {
      findAllOptions = { where: { inProgress } };
    }

    this._allMatches = await MatchModel.findAll({
      include: [
        { model: TeamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
      ...findAllOptions,
    });
    return this._allMatches;
  }
}

export default MatchService;
