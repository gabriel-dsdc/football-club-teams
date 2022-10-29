import TeamModel from '../database/models/Team';
import MatchModel from '../database/models/Match';
import UserService from './user.service';
import { homeOrAway, ILeaderboard, initialStats } from '../interfaces/ILeaderboard';

class LeaderboardService {
  private _allTeams: TeamModel[];
  private _allMatches: (MatchModel[])[];
  private _initialStats: ILeaderboard;
  private _teamStats: ILeaderboard;
  private _leaderboard: ILeaderboard[];
  protected userService: UserService;

  async allMatches(homeAway: homeOrAway) {
    this._allTeams = await TeamModel.findAll();
    const teamAssociation = homeAway[0].toUpperCase() + homeAway.slice(1);
    this._allMatches = await Promise.all(
      this._allTeams.map((team) => MatchModel.findAll({
        where: { [`${homeAway}Team`]: team.id, inProgress: false },
        include: {
          model: TeamModel,
          as: `team${teamAssociation}`,
          attributes: ['teamName'] },
      })),
    );
    return this._allMatches;
  }

  teamStats(
    name: string | undefined,
    totalGames: number,
    { totalPoints, totalVictories, totalDraws, totalLosses, goalsFavor, goalsOwn }: ILeaderboard,
  ) {
    this._teamStats = {
      name,
      totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: ((totalPoints / (totalGames * 3)) * 100).toFixed(2),
    };
    return this._teamStats;
  }

  sortLeaderboard() {
    this._leaderboard.sort((a, b) => (
      b.totalPoints - a.totalPoints || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor || a.goalsOwn - b.goalsOwn
    ));
  }

  calcScore(teamMatches: MatchModel[], team1: homeOrAway, team2: homeOrAway) {
    const finalStats = teamMatches.reduce((acc: ILeaderboard, match) => {
      this._initialStats = { ...acc };
      this._initialStats.goalsFavor += match[`${team1}TeamGoals`];
      this._initialStats.goalsOwn += match[`${team2}TeamGoals`];
      if (match[`${team1}TeamGoals`] === match[`${team2}TeamGoals`]) {
        this._initialStats.totalDraws += 1; this._initialStats.totalPoints += 1;
      } else if (match[`${team1}TeamGoals`] > match[`${team2}TeamGoals`]) {
        this._initialStats.totalVictories += 1; this._initialStats.totalPoints += 3;
      } else { this._initialStats.totalLosses += 1; }
      return this._initialStats;
    }, { ...initialStats });
    return finalStats;
  }

  async homeLeaderboard() {
    const allMatches = await this.allMatches('home');
    this._leaderboard = allMatches.map((teamMatches) => {
      const finalStats = this.calcScore(teamMatches, 'home', 'away');
      return this.teamStats(teamMatches[0].teamHome?.teamName, teamMatches.length, finalStats);
    }, []);
    this.sortLeaderboard();
    return this._leaderboard;
  }

  async awayLeaderboard() {
    const allMatches = await this.allMatches('away');
    this._leaderboard = allMatches.map((teamMatches) => {
      const finalStats = this.calcScore(teamMatches, 'away', 'home');
      return this.teamStats(teamMatches[0].teamAway?.teamName, teamMatches.length, finalStats);
    }, []);
    this.sortLeaderboard();
    return this._leaderboard;
  }
}

export default LeaderboardService;
