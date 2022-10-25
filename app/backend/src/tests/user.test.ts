import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import { user } from './mocks/user.mock';
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

  it('POST /login', async () => {
    res = await chai
       .request(app).post('/login').send({
        email: validUser.email,
        password: validUser.password
       });

    expect(res.status).to.equal(200);
    expect(userService.verifyToken(res.body.token)).to.deep.equal({
      id: dbUser.id,
      role: dbUser.role,
      username: dbUser.username,
      email: dbUser.email,
    });
  });

  it('POST /login, All fields must be filled', async () => {
    res = await chai.request(app).post('/login').send({
      password: validUser.password
    });
    expect(res.status).to.equal(400);
  });

  it('POST /login, Incorrect email or password', async () => {
    res = await chai.request(app).post('/login').send({
      email: 'email',
      password: 'password'
    });

    expect(res.status).to.equal(401);
    expect(userService.verifyToken(res.body)).to.deep.equal({
      message: 'Incorrect email or password'
    });
  });

});
