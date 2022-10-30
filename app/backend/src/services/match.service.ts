import TeamModel from '../database/models/Team';
import MatchModel from '../database/models/Match';
import UserService from './user.service';
import { IMatch } from '../interfaces/IMatch';

class MatchService {
  private _allMatches: MatchModel[];
  private _newMatch: MatchModel;
  private _updatedMatch: [number, MatchModel[]];
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
    if (match.homeTeam === match.awayTeam) {
      return { status: 422, message: 'It is not possible to create a match with two equal teams' };
    }
    const matchFind = await Promise.all(
      [match.homeTeam, match.awayTeam].map((id) => TeamModel.findOne({ where: { id } })),
    );

    if (matchFind.includes(null)) {
      return { status: 404, message: 'There is no team with such id!' };
    }
    this._newMatch = await MatchModel.create({ ...match, inProgress: true });
    return this._newMatch;
  }

  async finishMatch(id: number) {
    this._updatedMatch = await MatchModel.update({ inProgress: false }, { where: { id } });
    return this._updatedMatch;
  }

  async editMatch({ id, homeTeamGoals, awayTeamGoals }: IMatch) {
    this._updatedMatch = await MatchModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id, inProgress: true } },
    );
    return this._updatedMatch;
  }
}

export default MatchService;
