import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';
// import Match from './Match';

class Team extends Model {
  id!: number;
  teamName!: string;
}

Team.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    type: INTEGER,
    primaryKey: true,
  },
  teamName: {
    allowNull: false,
    type: STRING,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

// Team.hasMany(Match, { foreignKey: 'homeTeam', as: 'homeMatches' });
// Team.hasMany(Match, { foreignKey: 'awayTeam', as: 'awayMatches' });

export default Team;
