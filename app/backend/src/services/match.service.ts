import TeamModel from '../database/models/Team';
import MatchModel from '../database/models/Match';
import UserService from './user.service';
import { IMatch } from '../interfaces/IMatch';

class MatchService {
  private _allMatches: MatchModel[];
  private _newMatch: MatchModel;
  protected userService: UserService;

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

  async createMatch(match: IMatch) {
    this._newMatch = await MatchModel.create({ ...match, inProgress: true });
    return this._newMatch;
  }
}

export default MatchService;
