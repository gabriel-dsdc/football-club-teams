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

  describe('POST /login', () => {
    it('Token', async () => {
      res = await chai
         .request(app).post('/login').send({
          email: validUser.email,
          password: validUser.password
         });
      const payload = userService.verifyToken(res.body.token);
      payload.iat = 0;
      expect(res.status).to.equal(200);
      expect(payload).to.deep.equal({
        id: dbUser.id,
        role: dbUser.role,
        username: dbUser.username,
        email: dbUser.email,
        iat: 0
      });
    });
  
    it('All fields must be filled', async () => {
      res = await chai.request(app).post('/login').send({
        password: validUser.password
      });
      expect(res.status).to.equal(400);
    });
  
    it('Incorrect email or password', async () => {
      res = await chai.request(app).post('/login').send({
        email: 'email',
        password: 'password'
      });
  
      expect(res.status).to.equal(401);
      expect(res.body).to.deep.equal({
        message: 'Incorrect email or password'
      });
    });
  })

  describe('GET /login/validate', () => {
    it('Role', async () => {
      res = await chai.request(app).get('/login/validate').set('Authorization', token).send();
  
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        role: 'user'
      });
    });
  })
});
