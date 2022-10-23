import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  protected service: UserService;

  constructor() {
    this.service = new UserService();
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await this.service.login({ email, password });
    if (result.message) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  }
}

export default UserController;
