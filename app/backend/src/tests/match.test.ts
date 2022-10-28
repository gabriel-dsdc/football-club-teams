import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/Match';

import { Response } from 'superagent';
import { matchList } from './mocks/match.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Partidas', () => {
  let res: Response;

  beforeEach(async () => {
    sinon
      .stub(MatchModel, "findAll")
      .resolves(matchList as any);
  });

  afterEach(()=>{
    (MatchModel.findAll as sinon.SinonStub).restore();
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
});
