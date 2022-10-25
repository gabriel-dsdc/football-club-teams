import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/IUser';
import UserModel from '../database/models/User';

class UserService {
  protected jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET as string;
  }

  generateToken(payload: IUser) {
    const token = jwt.sign(JSON.parse(JSON.stringify(payload)), this.jwtSecret);
    return token;
  }

  verifyToken(token: string): IUser {
    const payload = jwt.verify(token, this.jwtSecret) as IUser;
    return payload;
  }

  async login({ email, password }: IUser) {
    try {
      const user = await UserModel.findOne({ where: { email } }) as UserModel;
      const passwordIsValid = bcrypt.compareSync(password as string, user.password);
      const payload = {
        id: user.id, username: user.username, role: user.role, email: user.email,
      };
      if (passwordIsValid) {
        const token = this.generateToken(payload);
        return { token };
      }
      throw new Error();
    } catch (error) {
      return { message: 'Incorrect email or password' };
    }
  }

  async validate(token: string | undefined) {
    if (token) {
      const { role } = this.verifyToken(token);
      return role;
    }
  }
}

export default UserService;
