export interface ILeaderboard {
  name?: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string
}

export const initialStats = {
  name: '',
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: '0.00',
};

export interface IFullLeaderboard {
  home: ILeaderboard,
  away: ILeaderboard
}

export type lbKey = 'totalPoints' | 'totalGames' | 'totalVictories'
| 'totalDraws' | 'totalLosses' | 'goalsFavor' | 'goalsOwn' | 'goalsBalance';

export type homeOrAway = 'home' | 'away';
