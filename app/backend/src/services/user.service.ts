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

  verifyToken(token: string) {
    const payload = jwt.verify(token, this.jwtSecret);
    return payload;
  }

  async login({ email, password }: IUser) {
    try {
      const user = await UserModel.findOne({ where: { email } }) as UserModel;
      const passwordIsValid = bcrypt.compareSync(password as string, user.password);
      if (passwordIsValid) {
        const token = this.generateToken(user as IUser);
        return { token };
      }
      throw new Error();
    } catch (error) {
      return { message: 'Incorrect email or password' };
    }
  }
}

export default UserService;
