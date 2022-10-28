import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/Team';

import { Response } from 'superagent';
import { teamList } from './mocks/team.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Times', () => {
  let res: Response;

  beforeEach(async () => {
    sinon
      .stub(TeamModel, "findAll")
      .resolves(teamList as TeamModel[]);
    sinon
    .stub(TeamModel, 'findByPk')
    .resolves(teamList[0] as TeamModel);
  });

  afterEach(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
    (TeamModel.findByPk as sinon.SinonStub).restore();
  })

  describe('GET /teams', () => {
    it('getAll', async () => {
      res = await chai.request(app).get('/teams').send();
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(teamList);
    });
  })

  describe('GET /teams/1', () => {
    it('getById', async () => {
      res = await chai.request(app).get('/teams/1').send();
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(teamList[0]);
    });
  })
});
