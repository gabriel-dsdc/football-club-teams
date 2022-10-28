import TeamModel from '../database/models/Team';
import MatchModel from '../database/models/Match';
import UserService from './user.service';
import { ILeaderboard, initialStats } from '../interfaces/ILeaderboard';

class LeaderboardService {
  private _allTeams: TeamModel[];
  private _allMatches: (MatchModel[])[];
  private _teamStats: ILeaderboard;
  protected userService: UserService;

  async allMatches() {
    this._allTeams = await TeamModel.findAll();
    this._allMatches = await Promise.all(
      this._allTeams.map((team) => MatchModel.findAll({
        where: { homeTeam: team.id, inProgress: false },
        include: { model: TeamModel, as: 'teamHome', attributes: ['teamName'] },
      })),
    );
    return this._allMatches;
  }

  teamStats(
    teamMatches: MatchModel[],
    { totalPoints, totalVictories, totalDraws, totalLosses, goalsFavor, goalsOwn }: ILeaderboard,
  ) {
    this._teamStats = {
      name: teamMatches[0].teamHome?.teamName,
      totalPoints,
      totalGames: teamMatches.length,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: ((totalPoints / (teamMatches.length * 3)) * 100).toFixed(2),
    };
    return this._teamStats;
  }

  async getAll() {
    const allMatches = await this.allMatches();
    const leaderboard = allMatches.map((teamMatches) => {
      const finalStats = teamMatches.reduce((acc2, match) => {
        const accCopy = { ...acc2 };
        accCopy.goalsFavor += match.homeTeamGoals; accCopy.goalsOwn += match.awayTeamGoals;
        if (match.homeTeamGoals === match.awayTeamGoals) {
          accCopy.totalDraws += 1; accCopy.totalPoints += 1;
        } else if (match.homeTeamGoals > match.awayTeamGoals) {
          accCopy.totalVictories += 1; accCopy.totalPoints += 3;
        } else { accCopy.totalLosses += 1; }
        return accCopy;
      }, { ...initialStats });
      return this.teamStats(teamMatches, finalStats);
    }, []);
    return leaderboard;
  }
}

export default LeaderboardService;
