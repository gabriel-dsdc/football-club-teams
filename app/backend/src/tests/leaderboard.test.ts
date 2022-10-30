import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/Team';

import { Response } from 'superagent';
import { teamList } from './mocks/team.mock';
import { awayAllMatchesMock, awayLeaderboardMock, homeAllMatchesMock, homeLeaderboardMock, leaderboardMock } from './mocks/leaderboard.mock';
import LeaderboardService from '../services/leaderboard.service';

chai.use(chaiHttp);

const { expect } = chai;

describe('Partidas', () => {
  let res: Response;

  beforeEach(async () => {
    sinon.stub(TeamModel, "findAll").resolves(teamList as TeamModel[]);
  });

  afterEach(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
  })

  describe('GET /leaderboard/home', () => {
    it('homeLeaderboard', async () => {
      sinon.stub(Promise, "all").resolves(homeAllMatchesMock);
      res = await chai.request(app).get('/leaderboard/home').send();
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(homeLeaderboardMock);
      (Promise.all as sinon.SinonStub).restore();
    });
  })

  describe('GET /leaderboard/away', () => {
    it('awayLeaderboard', async () => {
      sinon.stub(Promise, "all").resolves(awayAllMatchesMock);
      res = await chai.request(app).get('/leaderboard/away').send();
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(awayLeaderboardMock);
      (Promise.all as sinon.SinonStub).restore();
    });
  })

  describe('GET /leaderboard/', () => {
    it('leaderboard', async () => {
      sinon.stub(LeaderboardService.prototype, 'homeLeaderboard').resolves(homeLeaderboardMock);
      // sinon.stub(LeaderboardService.prototype, 'awayLeaderboard').resolves(awayLeaderboardMock);
      sinon.stub(LeaderboardService.prototype, 'awayLeaderboard').callsFake(async () => awayLeaderboardMock);
      res = await chai.request(app).get('/leaderboard').send();
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(leaderboardMock);
    });
  })
});
