import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import { user } from './mocks/user.mock';
const { dbUser, validUser } = user;

import * as jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET || "jwt_secret";
chai.use(chaiHttp);

const { expect } = chai;

describe('Users e Login', () => {
  let res: Response;

  beforeEach(async () => {
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
    expect(jwt.verify(res.body.token, jwtSecret)).to.deep.equal({
      id: dbUser.id,
      role: dbUser.role,
      username: dbUser.username,
      email: dbUser.email,
    });
  });

});
