import TeamModel from '../database/models/Team';
import MatchModel from '../database/models/Match';
import UserService from './user.service';
import { homeOrAway, IFullLeaderboard,
  ILeaderboard, initialStats, lbKey } from '../interfaces/ILeaderboard';

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

  async leaderboard() {
    const homeLb = await this.homeLeaderboard(); const awayLb = await this.awayLeaderboard();
    const homeAwayScores = homeLb.reduce((acc: IFullLeaderboard[], home) => {
      acc.push({ home, away: awayLb.find((tAway) => tAway.name === home.name) || home });
      return acc;
    }, []);
    this._leaderboard = homeAwayScores.reduce((acc: ILeaderboard[], { home, away }) => {
      const lbTeam = Object.keys(home).reduce((acc2: ILeaderboard, key) => {
        const lbObj = { ...acc2 };
        if (Object.prototype.hasOwnProperty.call(away, key)
        && typeof home[key as lbKey] !== 'string') {
          lbObj[key as lbKey] = (home[key as lbKey] + away[key as lbKey]);
        } return lbObj;
      }, { ...home });
      lbTeam.efficiency = ((lbTeam.totalPoints / (lbTeam.totalGames * 3)) * 100).toFixed(2);
      acc.push(lbTeam); return acc;
    }, []);
    this.sortLeaderboard(); return this._leaderboard;
  }
}

export default LeaderboardService;
