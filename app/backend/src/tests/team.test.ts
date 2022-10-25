import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import { token, user } from './mocks/user.mock';
const { dbUser, validUser } = user;

import UserService from '../services/user.service';
import { teamList } from './mocks/team.mock';
chai.use(chaiHttp);

const { expect } = chai;

describe('Users e Login', () => {
  let res: Response;
  let userService: UserService;

  beforeEach(async () => {
    userService = new UserService();
    sinon
      .stub(User, "findOne")
      .resolves({
        ...dbUser,
      } as User);
  });

  afterEach(()=>{
    (User.findOne as sinon.SinonStub).restore();
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
