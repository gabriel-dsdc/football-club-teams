import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/Match';
import TeamModel from '../database/models/Team';

import { Response } from 'superagent';
import { matchList, createMatchReqBody, createMatchReqBody422, editMatchReqBody, createMatchReqBody404 } from './mocks/match.mock';
import { token } from './mocks/user.mock';
import { teamList } from './mocks/team.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Partidas', () => {
  let res: Response;

  beforeEach(async () => {
    sinon.stub(MatchModel, "findAll").resolves(matchList as MatchModel[]);
    sinon.stub(MatchModel, "create").resolves({id: 1, ...createMatchReqBody, inProgress: true} as MatchModel);
    sinon.stub(TeamModel, "findOne").resolves(teamList[0] as TeamModel);
    sinon.stub(MatchModel, "update").resolves([1] as any);
  });

  afterEach(()=>{
    (MatchModel.findAll as sinon.SinonStub).restore();
    (MatchModel.create as sinon.SinonStub).restore();
    (TeamModel.findOne as sinon.SinonStub).restore();
    (MatchModel.update as sinon.SinonStub).restore();
  })
  
  describe('GET /matches', () => {
    it('getAll', async () => {
      res = await chai.request(app).get('/matches').send();
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(matchList);
    });

    it('getAll with filter', async () => {
      res = await chai.request(app).get('/matches?inProgress=false').send();
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(matchList);
    });
  })

  describe('POST /matches', () => {
    it('createMatch', async () => {
      res = await chai.request(app).post('/matches').set('Authorization', token).send(createMatchReqBody);
      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({id: 1, ...createMatchReqBody, inProgress: true});
    });

    it('createMatch with two equal teams (error 422)', async () => {
      res = await chai.request(app).post('/matches').set('Authorization', token).send(createMatchReqBody422);
      expect(res.status).to.equal(422);
      expect(res.body).to.deep.equal({ message: "It is not possible to create a match with two equal teams" });
    });

    it('createMatch with no team with such id (error 404)', async () => {
      (TeamModel.findOne as sinon.SinonStub).restore();
      sinon.stub(TeamModel, "findOne").resolves(null);
      res = await chai.request(app).post('/matches').set('Authorization', token).send(createMatchReqBody404);
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ message: 'There is no team with such id!' });
    });

    it('createMatch with invalid token (error 401)', async () => {
      res = await chai.request(app).post('/matches').set('Authorization', 'token').send();
      expect(res.status).to.equal(401);
      expect(res.body).to.deep.equal({ message: 'Token must be a valid token' });
    });
  })

  describe('PATCH /matches/:id/finish', () => {
    it('finishMatch', async () => {
      res = await chai.request(app).patch('/matches/1/finish').set('Authorization', token).send();
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: "Finished"});
    });
  })

  describe('PATCH /matches/:id', () => {
    it('editMatch', async () => {
      res = await chai.request(app).patch('/matches/1').set('Authorization', token).send(editMatchReqBody);
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: "Edited"});
    });

    it('editMatch | Not in Progress', async () => {
      (MatchModel.update as sinon.SinonStub).restore();
      sinon.stub(MatchModel, "update").resolves([0] as any);
      res = await chai.request(app).patch('/matches/2').set('Authorization', token).send(editMatchReqBody);
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: "Not in Progress"});
    });
  })
});
